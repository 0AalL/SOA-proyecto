package com.example.demo.repository;

import java.util.*;
import com.example.demo.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumnoRepositorio extends JpaRepository<Alumno, String> {

    // Ejemplos de búsquedas personalizadas opcionales:
    boolean existsByCedula(String cedula);
    Alumno findByCedula(String cedula);
    public default List<Alumno> listarTodos(){
        return this.findAll();
    }
}
