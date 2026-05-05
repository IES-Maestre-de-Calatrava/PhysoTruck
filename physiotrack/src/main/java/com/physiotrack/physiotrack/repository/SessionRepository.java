package com.physiotrack.physiotrack.repository;

import com.physiotrack.physiotrack.entity.Session;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("select s from Session s where s.paciente.id = :patientId")
    List<Session> findByPatientId(@Param("patientId") Long patientId);
}
