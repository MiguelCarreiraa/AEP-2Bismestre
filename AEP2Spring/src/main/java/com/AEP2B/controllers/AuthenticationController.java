package com.AEP2B.controllers;

import com.AEP2B.dto.LoginDTO;
import com.AEP2B.dto.RegisterDTO;
import com.AEP2B.models.UsuarioModel;
import com.AEP2B.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO data) {
        if (usuarioRepository.existsByEmail(data.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", "Email já cadastrado"));
        }

        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome(data.nome());
        usuario.setCpf(data.cpf());
        usuario.setEmail(data.email());
        usuario.setSenha(passwordEncoder.encode(data.senha()));
        usuario.setTipo(data.tipo());
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Registro realizado com sucesso"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO data) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(data.email(), data.senha())
        );

        UsuarioModel usuario = usuarioRepository.findByEmail(data.email()).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "mensagem", "Login realizado com sucesso",
                "email",    usuario.getEmail(),
                "nome",     usuario.getNome() != null ? usuario.getNome() : "",
                // CORREÇÃO: .name() garante que o enum vira String "ROLE_CIDADAO"
                // e não um objeto serializado incorretamente
                "tipo",     usuario.getTipo().name()
        ));
    }
}