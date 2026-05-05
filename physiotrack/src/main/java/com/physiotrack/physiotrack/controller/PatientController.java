package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.entity.Patient;
import com.physiotrack.physiotrack.entity.Session;
import com.physiotrack.physiotrack.repository.PatientRepository;
import com.physiotrack.physiotrack.repository.SessionRepository;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.IsoFields;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;
    private final SessionRepository sessionRepository;

    @GetMapping
    public List<PatientResponse> getPatients(@Parameter(hidden = true) Authentication authentication) {
        String therapistEmail = getAuthenticatedEmail(authentication);
        return patientRepository.findByTherapistEmail(therapistEmail).stream()
            .map(PatientResponse::from)
            .toList();
    }

    @GetMapping("/{id}/sessions/week/{week}")
    public List<SessionResponse> getPatientSessionsByWeek(
        @PathVariable Long id,
        @PathVariable int week,
        @Parameter(hidden = true) Authentication authentication
    ) {
        String therapistEmail = getAuthenticatedEmail(authentication);
        ensurePatientBelongsToTherapist(id, therapistEmail);
        WeekWindow weekWindow = resolveWeekWindow(week);

        return sessionRepository.findWeeklySessionsForPatient(
            id,
            therapistEmail,
            weekWindow.start(),
            weekWindow.endExclusive()
        ).stream().map(SessionResponse::from).toList();
    }

    private void ensurePatientBelongsToTherapist(Long patientId, String therapistEmail) {
        if (patientRepository.findAuthorizedPatient(patientId, therapistEmail).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado");
        }
    }

    private String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }
        return authentication.getName();
    }

    private WeekWindow resolveWeekWindow(int week) {
        int currentWeekBasedYear = LocalDate.now().get(IsoFields.WEEK_BASED_YEAR);
        int maxWeek = LocalDate.of(currentWeekBasedYear, 12, 28).get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

        if (week < 1 || week > maxWeek) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Semana no valida");
        }

        try {
            LocalDate startDate = LocalDate.of(currentWeekBasedYear, 1, 4)
                .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, week)
                .with(ChronoField.DAY_OF_WEEK, 1);
            return new WeekWindow(startDate.atStartOfDay(), startDate.plusWeeks(1).atStartOfDay());
        } catch (DateTimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Semana no valida");
        }
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

    private record WeekWindow(LocalDateTime start, LocalDateTime endExclusive) {
    }
}
