package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.entity.Patient;
import com.physiotrack.physiotrack.repository.PatientRepository;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.IsoFields;
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

    public void ensurePatientBelongsToTherapist(Long patientId, String therapistEmail) {
        if (patientRepository.findAuthorizedPatient(patientId, therapistEmail).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente no encontrado");
        }
    }

    public String getAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
        }
        return authentication.getName();
    }

    public WeekWindow resolveWeekWindow(int week) {
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

    public record WeekWindow(LocalDateTime start, LocalDateTime endExclusive) {
    }
}
