package com.AEP2B.controllers;

import com.AEP2B.models.UsuarioModel;
import com.AEP2B.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// NOVO ARQUIVO — estava sendo chamado pelo frontend em:
//   PUT /usuarios/perfil
//   PUT /usuarios/senha
// mas não existia no projeto.
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // GET /usuarios/perfil — retorna dados do usuário logado
    @GetMapping("/perfil")
    public ResponseEntity<?> meuPerfil(Authentication authentication) {
        return usuarioRepository.findByEmail(authentication.getName())
                .map(u -> ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "nome", u.getNome(),
                        "cpf", u.getCpf() != null ? u.getCpf() : "",
                        "email", u.getEmail(),
                        "tipo", u.getTipo().toString()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /usuarios/perfil — atualiza nome e cpf
    @PutMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(@RequestBody Map<String, String> body,
                                             Authentication authentication) {
        UsuarioModel usuario = usuarioRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        if (body.containsKey("nome") && !body.get("nome").isBlank()) {
            usuario.setNome(body.get("nome"));
        }
        if (body.containsKey("cpf")) {
            usuario.setCpf(body.get("cpf"));
        }

        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("mensagem", "Perfil atualizado com sucesso"));
    }

    // PUT /usuarios/senha — altera senha verificando a senha atual
    @PutMapping("/senha")
    public ResponseEntity<?> alterarSenha(@RequestBody Map<String, String> body,
                                          Authentication authentication) {
        UsuarioModel usuario = usuarioRepository
                .findByEmail(authentication.getName())
                .orElseThrow();

        String senhaAtual = body.get("senhaAtual");
        String novaSenha = body.get("novaSenha");

        // Verifica se a senha atual está correta
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            return ResponseEntity.status(400)
                    .body(Map.of("mensagem", "Senha atual incorreta"));
        }

        if (novaSenha == null || novaSenha.length() < 6) {
            return ResponseEntity.status(400)
                    .body(Map.of("mensagem", "Nova senha deve ter pelo menos 6 caracteres"));
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso"));
    }
}