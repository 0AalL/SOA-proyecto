package com.example.demo.web;


import com.example.demo.dto.AlumnoCreatedDTO;
import com.example.demo.entity.Alumno;
import com.example.demo.repository.AlumnoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alumnos")
@CrossOrigin("*") // opcional, para permitir peticiones desde cualquier frontend
public class AlumnoControlador {

    @Autowired
    private AlumnoRepositorio alumnoRepositorio;

    // Obtener todos
    @GetMapping
    public List<AlumnoCreatedDTO> obtenerTodos() {
        return alumnoRepositorio.findAll()
                .stream()
                .map(a -> new AlumnoCreatedDTO(

                        a.getCedula(),
                        a.getNombre(),
                        a.getApellido(),
                        a.getDireccion(),
                        a.getTelefono()
                ))
                .collect(Collectors.toList());
    }

    // Crear nuevo alumno
    @PostMapping
    public AlumnoCreatedDTO crear(@RequestBody AlumnoCreatedDTO dto) {
        Alumno alumno = new Alumno(
                dto.getCedula(),
                dto.getNombre(),
                dto.getApellido(),
                dto.getDireccion(),
                dto.getTelefono()
        );
        alumno = alumnoRepositorio.save(alumno);
        return dto;
    }

    // Obtener por ID
    @GetMapping("/{cedula}")
    public AlumnoCreatedDTO obtenerPorId(@PathVariable String cedula) {
        Alumno alumno = alumnoRepositorio.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        return new AlumnoCreatedDTO(
                alumno.getCedula(),
                alumno.getNombre(),
                alumno.getApellido(),
                alumno.getDireccion(),
                alumno.getTelefono()
        );
    }

    // Actualizar
    @PutMapping("/{cedula}")
    public AlumnoCreatedDTO actualizar(@PathVariable String cedula, @RequestBody AlumnoCreatedDTO dto) {
        Alumno alumno = alumnoRepositorio.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        alumno.setNombre(dto.getNombre());
        alumno.setApellido(dto.getApellido());
        alumno.setDireccion(dto.getDireccion());
        alumno.setTelefono(dto.getTelefono());

        alumnoRepositorio.save(alumno);

        return dto;
    }

    // Eliminar
    @DeleteMapping("/{cedula}")
    public void eliminar(@PathVariable String cedula) {
        alumnoRepositorio.deleteById(cedula);
    }
}
