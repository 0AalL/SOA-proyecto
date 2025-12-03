package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoCreatedDTO {

    @NotBlank(message = "La cédula es obligatoria")
    @Size(min = 10, max = 10, message = "La cédula debe tener 10 dígitos")
    @Pattern(regexp = "^([0][1-9]|1[0-9]|2[0-4])[0-9]{8}$", message = "La cédula debe empezar con código de provincia 01-24 y contener solo números")
    private String cedula;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 1, max = 100, message = "El nombre debe tener entre 1 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 1, max = 100, message = "El apellido debe tener entre 1 y 100 caracteres")
    private String apellido;

    @Size(max = 200, message = "La dirección puede tener hasta 200 caracteres")
    private String direccion;

    @Size(min = 7, max = 20, message = "El teléfono debe tener entre 7 y 20 dígitos")
    @Pattern(regexp = "^[0-9]+$", message = "El teléfono debe contener solo números")
    private String telefono;
}
