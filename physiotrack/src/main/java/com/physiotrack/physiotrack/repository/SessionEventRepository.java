package com.physiotrack.physiotrack.repository;

import com.physiotrack.physiotrack.entity.SessionEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionEventRepository extends JpaRepository<SessionEvent, Long> {

    @Query("select se from SessionEvent se where se.session.id = :sessionId")
    List<SessionEvent> findBySessionId(@Param("sessionId") Long sessionId);

    @Query("select se from SessionEvent se where se.session.id in :sessionIds")
    List<SessionEvent> findBySessionIds(@Param("sessionIds") List<Long> sessionIds);
}
