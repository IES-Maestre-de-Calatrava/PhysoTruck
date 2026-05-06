package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.entity.Patient;
import com.physiotrack.physiotrack.repository.PatientRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class PatientAccessHelper {

    private final PatientRepository patientRepository;

    public List<Patient> findPatientsByTherapistEmail(String therapistEmail) {
        return patientRepository.findByTherapistEmail(therapistEmail);
    }

    public Patient getAuthorizedPatient(Long patientId, String therapistEmail) {
        return patientRepository.findAuthorizedPatient(patientId, therapistEmail)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado"));
    }

    public void ensurePatientBelongsToTherapist(Long patientId, String therapistEmail) {
        getAuthorizedPatient(patientId, therapistEmail);
    }

    public String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }
        return authentication.getName();
    }

    public WeekWindow resolveWeekWindow(int week, LocalDate treatmentStart) {
        if (week < 1 || week > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Semana no valida: debe estar entre 1 y 12");
        }
        LocalDateTime start = treatmentStart.plusWeeks(week - 1).atStartOfDay();
        LocalDateTime end = treatmentStart.plusWeeks(week).atStartOfDay();
        return new WeekWindow(start, end);
    }

    public record WeekWindow(LocalDateTime start, LocalDateTime endExclusive) {
    }
}
