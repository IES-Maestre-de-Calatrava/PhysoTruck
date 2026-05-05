package com.physiotrack.physiotrack.controller;

import com.physiotrack.physiotrack.controller.PatientAccessHelper.WeekWindow;
import com.physiotrack.physiotrack.entity.Session;
import com.physiotrack.physiotrack.entity.SessionEvent;
import com.physiotrack.physiotrack.repository.SessionEventRepository;
import com.physiotrack.physiotrack.repository.SessionRepository;
import io.swagger.v3.oas.annotations.Parameter;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final PatientAccessHelper patientAccessHelper;
    private final SessionRepository sessionRepository;
    private final SessionEventRepository sessionEventRepository;

    @GetMapping("/weekly/{patientId}/{week}")
    public WeeklyStatsResponse getWeeklyStats(
        @PathVariable Long patientId,
        @PathVariable int week,
        @Parameter(hidden = true) Authentication authentication
    ) {
        String therapistEmail = patientAccessHelper.getAuthenticatedEmail(authentication);
        patientAccessHelper.ensurePatientBelongsToTherapist(patientId, therapistEmail);
        WeekWindow weekWindow = patientAccessHelper.resolveWeekWindow(week);

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
        long completedSessions = sessions.stream().filter(Session::isCompletada).count();
        int totalDurationSeconds = sessions.stream()
            .map(Session::getDuracionSegundos)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .sum();
        Double averageDurationSeconds = sessions.stream()
            .map(Session::getDuracionSegundos)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .average()
            .isPresent() ? sessions.stream()
            .map(Session::getDuracionSegundos)
            .filter(Objects::nonNull)
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0) : null;
        Double averageIntensity = events.stream()
            .map(SessionEvent::getIntensidad)
            .filter(Objects::nonNull)
            .mapToDouble(Double::doubleValue)
            .average()
            .isPresent() ? events.stream()
            .map(SessionEvent::getIntensidad)
            .filter(Objects::nonNull)
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0) : null;

        return new WeeklyStatsResponse(
            patientId,
            LocalDate.now().get(IsoFields.WEEK_BASED_YEAR),
            week,
            weekWindow.start().toLocalDate(),
            weekWindow.endExclusive().minusDays(1).toLocalDate(),
            totalSessions,
            completedSessions,
            totalDurationSeconds,
            averageDurationSeconds,
            events.size(),
            averageIntensity
        );
    }

    public record WeeklyStatsResponse(
        Long patientId,
        int year,
        int week,
        LocalDate weekStart,
        LocalDate weekEnd,
        int totalSessions,
        long completedSessions,
        int totalDurationSeconds,
        Double averageDurationSeconds,
        int totalEvents,
        Double averageIntensity
    ) {
    }
}
