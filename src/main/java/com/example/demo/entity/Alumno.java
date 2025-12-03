package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "alumnos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alumno {
    @Id
    @Column(length = 10)
    @Size(min = 10, max = 10, message = "La cédula debe tener exactamente 10 caracteres")
    @Pattern(regexp = "\\d{10}", message = "La cédula debe contener solo dígitos")
    private String cedula;

    @Column(length = 100, nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String nombre;

    @Column(length = 100, nullable = false)
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100)
    private String apellido;

    @Column(length = 200)
    private String direccion;

    @Column(length = 10)
    @Size(min = 10, max = 10, message = "El teléfono debe tener exactamente 10 caracteres")
    @Pattern(regexp = "\\d{10}", message = "El teléfono debe contener solo dígitos")
    private String telefono;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "curso_id", foreignKey = @ForeignKey(name = "fk_alumnos_curso"))
    @JsonBackReference
    private Curso curso;
}