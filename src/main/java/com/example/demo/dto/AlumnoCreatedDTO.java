package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoCreatedDTO {

    private String cedula;
    private String nombre;
    private String apellido;
    private String direccion;
    private String telefono;
}
