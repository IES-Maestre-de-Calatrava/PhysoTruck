package com.physiotrack.physiotrack.seeder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.physiotrack.physiotrack.entity.Patient;
import com.physiotrack.physiotrack.entity.Session;
import com.physiotrack.physiotrack.entity.SessionEvent;
import com.physiotrack.physiotrack.entity.User;
import com.physiotrack.physiotrack.repository.PatientRepository;
import com.physiotrack.physiotrack.repository.UserRepository;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final String DATA_FILE = "datos_prueba.json";
    private static final String DEFAULT_DIAGNOSIS = "Datos de prueba importados desde JSON";

    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepo.count() > 0) {
            return;
        }

        User therapist = userRepo.save(
            User.builder()
                .email("fisio@sescam.es")
                .passwordHash(passwordEncoder.encode("password123"))
                .fullName("Fisio Demo")
                .sescamId("FISIO-DEMO")
                .build()
        );

        JsonNode root = readSeedData();
        Iterator<Map.Entry<String, JsonNode>> patients = root.fields();

        while (patients.hasNext()) {
            Map.Entry<String, JsonNode> patientEntry = patients.next();
            JsonNode sessionsByDate = patientEntry.getValue().path("sesiones");
            LocalDate treatmentStart = resolveTreatmentStart(sessionsByDate);
            List<Session> sessions = buildSessions(sessionsByDate, treatmentStart);

            Integer currentLevel = sessions.stream()
                .max(Comparator.comparing(Session::getStartedAt))
                .map(Session::getDrivingLevel)
                .orElse(null);

            Patient patient = Patient.builder()
                .fullName(patientEntry.getKey())
                .diagnosis(DEFAULT_DIAGNOSIS)
                .treatmentStart(treatmentStart)
                .currentLevel(currentLevel)
                .therapist(therapist)
                .sessions(new ArrayList<>())
                .build();

            for (Session session : sessions) {
                session.setPatient(patient);
                patient.getSessions().add(session);
            }

            patientRepo.save(patient);
        }
    }

    private JsonNode readSeedData() throws IOException {
        ClassPathResource resource = new ClassPathResource(DATA_FILE);
        try (InputStream inputStream = resource.getInputStream()) {
            return objectMapper.readTree(inputStream);
        }
    }

    private LocalDate resolveTreatmentStart(JsonNode sessionsByDate) {
        Iterator<String> dates = sessionsByDate.fieldNames();
        LocalDate earliestDate = null;

        while (dates.hasNext()) {
            LocalDate date = LocalDate.parse(dates.next());
            if (earliestDate == null || date.isBefore(earliestDate)) {
                earliestDate = date;
            }
        }

        return earliestDate;
    }

    private List<Session> buildSessions(JsonNode sessionsByDate, LocalDate treatmentStart) {
        List<Session> sessions = new ArrayList<>();
        Iterator<Map.Entry<String, JsonNode>> dateEntries = sessionsByDate.fields();

        while (dateEntries.hasNext()) {
            Map.Entry<String, JsonNode> dateEntry = dateEntries.next();
            LocalDate sessionDate = LocalDate.parse(dateEntry.getKey());
            Iterator<Map.Entry<String, JsonNode>> sessionEntries = dateEntry.getValue().fields();

            while (sessionEntries.hasNext()) {
                Map.Entry<String, JsonNode> sessionEntry = sessionEntries.next();
                JsonNode sessionNode = sessionEntry.getValue();
                int score = sessionNode.path("score").asInt(0);
                int movementTime = sessionNode.path("tiempo_movimiento").asInt(0);
                LocalDateTime startedAt = resolveStartedAt(sessionDate, sessionNode.path("timestamp").asLong(0L));

                Session session = Session.builder()
                    .externalId(sessionEntry.getKey())
                    .startedAt(startedAt)
                    .endedAt(startedAt.plus(movementTime, ChronoUnit.MILLIS))
                    .movementTime(movementTime)
                    .stabilityScore(sessionNode.path("estabilidad").asDouble(0))
                    .drivingScore((double) score)
                    .drivingLevel(resolveDrivingLevel(score))
                    .weekNumber(resolveWeekNumber(treatmentStart, sessionDate))
                    .sessionEvents(new ArrayList<>())
                    .build();

                session.getSessionEvents().add(buildEvent("COLLISIONS", sessionNode.path("colisiones").asInt(0), session));
                session.getSessionEvents().add(
                    buildEvent("HARSH_ACCELERATIONS", sessionNode.path("aceleraciones_bruscas").asInt(0), session)
                );
                session.getSessionEvents().add(
                    buildEvent("HARSH_STOPS", sessionNode.path("paradas_bruscas").asInt(0), session)
                );

                sessions.add(session);
            }
        }

        sessions.sort(Comparator.comparing(Session::getStartedAt));
        return sessions;
    }

    private LocalDateTime resolveStartedAt(LocalDate sessionDate, long timestampSeconds) {
        if (timestampSeconds <= 0) {
            return sessionDate.atStartOfDay();
        }

        return Instant.ofEpochSecond(timestampSeconds)
            .atOffset(ZoneOffset.UTC)
            .toLocalDateTime();
    }

    private int resolveWeekNumber(LocalDate treatmentStart, LocalDate sessionDate) {
        if (treatmentStart == null) {
            return 1;
        }

        return (int) ChronoUnit.WEEKS.between(treatmentStart, sessionDate) + 1;
    }

    private int resolveDrivingLevel(int score) {
        if (score <= 20) {
            return 1;
        }
        if (score <= 40) {
            return 2;
        }
        if (score <= 50) {
            return 3;
        }
        if (score <= 75) {
            return 4;
        }
        if (score <= 89) {
            return 5;
        }
        return 6;
    }

    private SessionEvent buildEvent(String eventType, int count, Session session) {
        return SessionEvent.builder()
            .eventType(eventType)
            .count(count)
            .session(session)
            .build();
    }
}
