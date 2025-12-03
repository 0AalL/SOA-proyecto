package com.example.demo.repository;

import com.example.demo.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlumnoRepository extends JpaRepository<Alumno, String> {
    List<Alumno> findByCursoId(Long cursoId);
    List<Alumno> findByCedulaContaining(String q);
}