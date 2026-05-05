package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.entity.Session;
import com.physiotrack.physiotrack.entity.SessionEvent;
import com.physiotrack.physiotrack.repository.PatientRepository;
import com.physiotrack.physiotrack.repository.SessionEventRepository;
import com.physiotrack.physiotrack.repository.SessionRepository;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final PatientRepository patientRepository;
    private final SessionRepository sessionRepository;
    private final SessionEventRepository sessionEventRepository;

    @GetMapping("/weekly/{patientId}/{week}")
    public WeeklyStatsResponse getWeeklyStats(
        @PathVariable Long patientId,
        @PathVariable int week,
        @Parameter(hidden = true) Authentication authentication
    ) {
        String therapistEmail = getAuthenticatedEmail(authentication);
        ensurePatientBelongsToTherapist(patientId, therapistEmail);
        WeekWindow weekWindow = resolveWeekWindow(week);

        List<Session> sessions = sessionRepository.findWeeklySessionsForPatient(
            patientId,
            therapistEmail,
            weekWindow.start(),
            weekWindow.endExclusive()
        );

        List<Long> sessionIds = sessions.stream().map(Session::getId).toList();
        List<SessionEvent> events = sessionIds.isEmpty()
            ? List.of()
            : sessionEventRepository.findBySessionIds(sessionIds);

        int totalSessions = sessions.size();
        int totalMovementTime = sessions.stream()
            .map(Session::getMovementTime)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .sum();
        Double averageMovementTime = sessions.stream()
            .map(Session::getMovementTime)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0);
        Double averageStabilityScore = sessions.stream()
            .map(Session::getStabilityScore)
            .filter(Objects::nonNull)
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
        Double averageDrivingScore = sessions.stream()
            .map(Session::getDrivingScore)
            .filter(Objects::nonNull)
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
        Double averageDrivingLevel = sessions.stream()
            .map(Session::getDrivingLevel)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0);
        int totalEventCount = events.stream()
            .map(SessionEvent::getCount)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .sum();

        return new WeeklyStatsResponse(
            patientId,
            LocalDate.now().get(IsoFields.WEEK_BASED_YEAR),
            week,
            weekWindow.start().toLocalDate(),
            weekWindow.endExclusive().minusDays(1).toLocalDate(),
            totalSessions,
            totalMovementTime,
            averageMovementTime,
            averageStabilityScore,
            averageDrivingScore,
            averageDrivingLevel,
            events.size(),
            totalEventCount
        );
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

    public record WeeklyStatsResponse(
        Long patientId,
        int year,
        int week,
        LocalDate weekStart,
        LocalDate weekEnd,
        int totalSessions,
        int totalMovementTime,
        Double averageMovementTime,
        Double averageStabilityScore,
        Double averageDrivingScore,
        Double averageDrivingLevel,
        int totalEvents,
        int totalEventCount
    ) {
    }

    private record WeekWindow(LocalDateTime start, LocalDateTime endExclusive) {
    }
}
