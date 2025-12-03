package com.example.demo.config;

import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder encoder;

    @Bean
    CommandLineRunner init(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByEmail("admin@uta.edu.ec").isEmpty()) {
                usuarioRepository.save(Usuario.builder()
                        .email("admin@uta.edu.ec")
                        .password(encoder.encode("admin123"))
                        .rol("ADMINISTRADOR")
                        .build());
            }
            if (usuarioRepository.findByEmail("secretaria@uta.edu.ec").isEmpty()) {
                usuarioRepository.save(Usuario.builder()
                        .email("secretaria@uta.edu.ec")
                        .password(encoder.encode("sec123"))
                        .rol("SECRETARIA")
                        .build());
            }
        };
    }
}