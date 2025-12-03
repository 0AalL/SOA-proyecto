package com.example.demo.web;

import com.example.demo.dto.AlumnoViewDTO;
import com.example.demo.entity.Alumno;
import com.example.demo.entity.Curso;
import com.example.demo.repository.AlumnoRepository;
import com.example.demo.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
public class AlumnoController {

    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;

    // CRUD alumnos (SECRETARIA y ADMINISTRADOR)
    @GetMapping
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public List<AlumnoViewDTO> listar() {
        return alumnoRepository.findAll().stream().map(this::toView).toList();
    }

    // Buscar por cédula (LIKE) para el cliente
    @GetMapping("/buscar")
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public List<AlumnoViewDTO> buscar(@RequestParam(name = "q", required = false, defaultValue = "") String q) {
        List<Alumno> base = (q == null || q.isBlank())
                ? alumnoRepository.findAll()
                : alumnoRepository.findByCedulaContaining(q.trim());
        return base.stream().map(this::toView).toList();
    }

    @GetMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public ResponseEntity<AlumnoViewDTO> obtener(@PathVariable String cedula) {
        return alumnoRepository.findById(cedula)
                .map(a -> ResponseEntity.ok(toView(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public ResponseEntity<?> crear(@RequestBody Alumno alumno) {
        if (alumnoRepository.existsById(alumno.getCedula())) {
            return ResponseEntity.status(409).body("La cédula ya existe");
        }
        // curso opcional: no asignamos aquí
        Alumno creado = alumnoRepository.save(alumno);
        return ResponseEntity.created(URI.create("/api/alumnos/" + creado.getCedula())).body(creado);
    }

    @PutMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public ResponseEntity<?> actualizar(@PathVariable String cedula, @RequestBody Alumno alumno) {
        return alumnoRepository.findById(cedula).map(existing -> {
            existing.setNombre(alumno.getNombre());
            existing.setApellido(alumno.getApellido());
            existing.setDireccion(alumno.getDireccion());
            existing.setTelefono(alumno.getTelefono());
            // No cambiamos curso aquí; se hace con endpoint específico
            Alumno actualizado = alumnoRepository.save(existing);
            return ResponseEntity.ok(toView(actualizado));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cedula}")
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable String cedula) {
        if (!alumnoRepository.existsById(cedula)) return ResponseEntity.notFound().build();
        alumnoRepository.deleteById(cedula);
        return ResponseEntity.noContent().build();
    }

    // Asignar un estudiante a un curso (ADMINISTRADOR)
    @PostMapping("/{cedula}/asignar/{cursoId}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> asignarCurso(@PathVariable String cedula, @PathVariable Long cursoId) {
        Alumno alumno = alumnoRepository.findById(cedula).orElse(null);
        if (alumno == null) return ResponseEntity.notFound().build();

        Curso curso = cursoRepository.findById(cursoId).orElse(null);
        if (curso == null) return ResponseEntity.badRequest().body("cursoId inválido");

        alumno.setCurso(curso);
        alumnoRepository.save(alumno);
        return ResponseEntity.ok(alumno);
    }

    // Asignar (o desasignar) curso vía query param. Si no se envía cursoId, se desasigna.
    @PostMapping("/{cedula}/asignar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> asignarCursoParam(@PathVariable String cedula,
                                               @RequestParam(name = "cursoId", required = false) Long cursoId) {
        Alumno alumno = alumnoRepository.findById(cedula).orElse(null);
        if (alumno == null) return ResponseEntity.notFound().build();

        if (cursoId == null) {
            alumno.setCurso(null); // desasignar
            alumnoRepository.save(alumno);
            return ResponseEntity.ok(alumno);
        }

        Curso curso = cursoRepository.findById(cursoId).orElse(null);
        if (curso == null) return ResponseEntity.badRequest().body("cursoId inválido");

        alumno.setCurso(curso);
        alumnoRepository.save(alumno);
        return ResponseEntity.ok(alumno);
    }

    // Obtener todos los estudiantes que pertenecen a un curso
    @GetMapping("/por-curso/{cursoId}")
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public ResponseEntity<List<AlumnoViewDTO>> listarPorCurso(@PathVariable Long cursoId) {
        if (!cursoRepository.existsById(cursoId)) return ResponseEntity.notFound().build();
        List<AlumnoViewDTO> data = alumnoRepository.findByCursoId(cursoId).stream().map(this::toView).toList();
        return ResponseEntity.ok(data);
    }

    // Consultar el curso al que pertenece un estudiante
    @GetMapping("/{cedula}/curso")
    @PreAuthorize("hasAnyRole('SECRETARIA','ADMINISTRADOR')")
    public ResponseEntity<?> cursoDeAlumno(@PathVariable String cedula) {
        return alumnoRepository.findById(cedula).map(a -> {
            if (a.getCurso() == null) return ResponseEntity.noContent().build();
            return ResponseEntity.ok(a.getCurso());
        }).orElse(ResponseEntity.notFound().build());
    }

    private AlumnoViewDTO toView(Alumno a) {
        Curso c = a.getCurso();
        Long cursoId = c != null ? c.getId() : null;
        String cursoNombre = c != null ? c.getNombre() : null;
        return new AlumnoViewDTO(a.getCedula(), a.getNombre(), a.getApellido(), a.getDireccion(), a.getTelefono(), cursoId, cursoNombre);
    }
}