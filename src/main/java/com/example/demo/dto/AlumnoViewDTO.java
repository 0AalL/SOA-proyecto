package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AlumnoViewDTO {
    private String cedula;
    private String nombre;
    private String apellido;
    private String direccion;
    private String telefono;
    private Long cursoId;
    private String cursoNombre;
}
