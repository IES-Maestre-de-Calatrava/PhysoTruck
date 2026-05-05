package com.physiotrack.physiotrack.repository;

import com.physiotrack.physiotrack.entity.SessionEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionEventRepository extends JpaRepository<SessionEvent, Long> {

    @Query("select se from SessionEvent se where se.sesion.id = :sessionId")
    List<SessionEvent> findBySessionId(@Param("sessionId") Long sessionId);
}
