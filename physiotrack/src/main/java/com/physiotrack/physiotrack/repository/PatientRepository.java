package com.physiotrack.physiotrack.repository;

import com.physiotrack.physiotrack.entity.Patient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("select p from Patient p where p.fisioterapeuta.id = :therapistId")
    List<Patient> findByTherapistId(@Param("therapistId") Long therapistId);
}
