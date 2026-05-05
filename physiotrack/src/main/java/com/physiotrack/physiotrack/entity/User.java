package com.physiotrack.physiotrack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_user_numero_colegiado", columnNames = "numero_colegiado")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombre;

    @Column(nullable = false, length = 120)
    private String apellidos;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 255)
    private String contrasena;

    @Column(length = 20)
    private String telefono;

    @Column(name = "numero_colegiado", nullable = false, length = 30)
    private String numeroColegiado;

    @Default
    @Column(nullable = false)
    private boolean activo = true;
}
