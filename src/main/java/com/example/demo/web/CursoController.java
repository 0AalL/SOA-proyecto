package com.example.demo.web;


import com.example.demo.entity.Curso;
import com.example.demo.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoRepository cursoRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public List<Curso> listar() {
        return cursoRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Curso> obtener(@PathVariable Long id) {
        return cursoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Curso> crear(@RequestBody Curso curso) {
        if (curso.getId() != null) return ResponseEntity.badRequest().build();
        if (cursoRepository.existsByNombre(curso.getNombre())) return ResponseEntity.status(409).build();
        Curso creado = cursoRepository.save(curso);
        return ResponseEntity.created(URI.create("/api/cursos/" + creado.getId())).body(creado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Curso> actualizar(@PathVariable Long id, @RequestBody Curso curso) {
        return cursoRepository.findById(id).map(existing -> {
            existing.setNombre(curso.getNombre());
            existing.setDescripcion(curso.getDescripcion());
            return ResponseEntity.ok(cursoRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!cursoRepository.existsById(id)) return ResponseEntity.notFound().build();
        cursoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}