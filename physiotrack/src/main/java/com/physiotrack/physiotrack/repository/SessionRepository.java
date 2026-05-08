package com.physiotrack.physiotrack.repository;

import com.physiotrack.physiotrack.entity.Session;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("select s from Session s where s.patient.id = :patientId")
    List<Session> findByPatientId(@Param("patientId") Long patientId);

    @Query("""
        select s
        from Session s
        where s.patient.id = :patientId
          and s.weekNumber = :weekNumber
        order by s.startedAt
        """)
    List<Session> findByPatientIdAndWeekNumber(
        @Param("patientId") Long patientId,
        @Param("weekNumber") Integer weekNumber
    );

    @Query("""
        select distinct s
        from Session s
        left join fetch s.sessionEvents se
        where s.patient.id = :patientId
          and s.patient.therapist.email = :email
          and s.weekNumber = :weekNumber
        order by s.startedAt
        """)
    List<Session> findWeeklySessionsForPatientByWeekNumber(
        @Param("patientId") Long patientId,
        @Param("email") String email,
        @Param("weekNumber") Integer weekNumber
    );

    @Query("""
        select s
        from Session s
        where s.patient.id = :patientId
          and s.patient.therapist.email = :email
          and s.startedAt >= :start
          and s.startedAt < :end
        order by s.startedAt
        """)
    List<Session> findWeeklySessionsForPatient(
        @Param("patientId") Long patientId,
        @Param("email") String email,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

    @Query("""
        select s
        from Session s
        where s.patient.id = :patientId
          and s.patient.therapist.email = :email
        order by s.weekNumber, s.startedAt
        """)
    List<Session> findAllForPatient(
        @Param("patientId") Long patientId,
        @Param("email") String email
    );
}
