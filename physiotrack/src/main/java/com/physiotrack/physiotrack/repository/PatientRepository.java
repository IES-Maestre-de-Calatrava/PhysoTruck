package com.physiotrack.physiotrack.repository;

import com.physiotrack.physiotrack.entity.Patient;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("select p from Patient p where p.therapist.id = :therapistId")
    List<Patient> findByTherapistId(@Param("therapistId") Long therapistId);

    @Query("select p from Patient p where p.therapist.email = :email order by p.fullName")
    List<Patient> findByTherapistEmail(@Param("email") String email);

    @Query("select p from Patient p where p.id = :patientId and p.therapist.email = :email")
    Optional<Patient> findAuthorizedPatient(
        @Param("patientId") Long patientId,
        @Param("email") String email
    );
}
