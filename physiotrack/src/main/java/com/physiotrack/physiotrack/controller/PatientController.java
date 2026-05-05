package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.entity.Patient;
import com.physiotrack.physiotrack.entity.Session;
import com.physiotrack.physiotrack.controller.PatientAccessHelper.WeekWindow;
import com.physiotrack.physiotrack.repository.SessionRepository;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientAccessHelper patientAccessHelper;
    private final SessionRepository sessionRepository;

    @GetMapping
    public List<PatientResponse> getPatients(@Parameter(hidden = true) Authentication authentication) {
        String therapistEmail = patientAccessHelper.getAuthenticatedEmail(authentication);
        return patientAccessHelper.findPatientsByTherapistEmail(therapistEmail).stream()
            .map(PatientResponse::from)
            .toList();
    }

    @GetMapping("/{id}/sessions/week/{week}")
    public List<SessionResponse> getPatientSessionsByWeek(
        @PathVariable Long id,
        @PathVariable int week,
        @Parameter(hidden = true) Authentication authentication
    ) {
        String therapistEmail = patientAccessHelper.getAuthenticatedEmail(authentication);
        patientAccessHelper.ensurePatientBelongsToTherapist(id, therapistEmail);
        WeekWindow weekWindow = patientAccessHelper.resolveWeekWindow(week);

        return sessionRepository.findWeeklySessionsForPatient(
            id,
            therapistEmail,
            weekWindow.start(),
            weekWindow.endExclusive()
        ).stream().map(SessionResponse::from).toList();
    }

    public record PatientResponse(
        Long id,
        String nombre,
        String apellidos,
        LocalDate fechaNacimiento,
        String diagnostico,
        String observaciones,
        boolean activo
    ) {
        private static PatientResponse from(Patient patient) {
            return new PatientResponse(
                patient.getId(),
                patient.getNombre(),
                patient.getApellidos(),
                patient.getFechaNacimiento(),
                patient.getDiagnostico(),
                patient.getObservaciones(),
                patient.isActivo()
            );
        }
    }

    public record SessionResponse(
        Long id,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Integer duracionSegundos,
        String observaciones,
        boolean completada
    ) {
        private static SessionResponse from(Session session) {
            return new SessionResponse(
                session.getId(),
                session.getFechaInicio(),
                session.getFechaFin(),
                session.getDuracionSegundos(),
                session.getObservaciones(),
                session.isCompletada()
            );
        }
    }
}
