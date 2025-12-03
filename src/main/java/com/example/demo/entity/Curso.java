package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 150, nullable = false, unique = true)
    private String nombre;

    @Column(length = 300)
    private String descripcion;

    @OneToMany(mappedBy = "curso", cascade = CascadeType.PERSIST)
    @JsonManagedReference
    @Builder.Default
    private List<Alumno> alumnos = new ArrayList<>();
}