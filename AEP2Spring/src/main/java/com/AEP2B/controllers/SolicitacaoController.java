package com.AEP2B.controllers;

import com.AEP2B.enums.Categoria;
import com.AEP2B.enums.LocalTipo;
import com.AEP2B.enums.Status;
import com.AEP2B.models.HistoricoStatusModel;
import com.AEP2B.models.SolicitacaoModel;
import com.AEP2B.repositories.UsuarioRepository;
import com.AEP2B.services.SolicitacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    @Autowired private SolicitacaoService solicitacaoService;
    @Autowired private UsuarioRepository usuarioRepository;

    // ==================== GESTOR ====================

    @PreAuthorize("hasRole('GESTOR')")
    @GetMapping
    public ResponseEntity<List<SolicitacaoModel>> listarTodas() {
        return ResponseEntity.ok(solicitacaoService.listarTodas());
    }

    @PreAuthorize("hasRole('GESTOR')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<SolicitacaoModel>> buscarPorStatus(@PathVariable Status status) {
        return ResponseEntity.ok(solicitacaoService.buscarPorStatus(status));
    }

    @PreAuthorize("hasRole('GESTOR')")
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<SolicitacaoModel>> buscarPorCategoria(@PathVariable Categoria categoria) {
        return ResponseEntity.ok(solicitacaoService.buscarPorCategoria(categoria));
    }

    @PreAuthorize("hasRole('GESTOR')")
    @GetMapping("/bairro/{bairro}")
    public ResponseEntity<List<SolicitacaoModel>> buscarPorBairro(@PathVariable String bairro) {
        return ResponseEntity.ok(solicitacaoService.buscarPorBairro(bairro));
    }

    @PreAuthorize("hasRole('GESTOR')")
    @GetMapping("/local/{localTipo}")
    public ResponseEntity<List<SolicitacaoModel>> buscarPorLocal(@PathVariable LocalTipo localTipo) {
        return ResponseEntity.ok(solicitacaoService.buscarPorLocal(localTipo));
    }

    @PreAuthorize("hasRole('GESTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoModel> atualizar(@PathVariable Long id,
                                                      @RequestBody SolicitacaoModel s) {
        if (solicitacaoService.buscarPorId(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(solicitacaoService.atualizar(id, s));
    }

    @PreAuthorize("hasRole('GESTOR')")
    @PutMapping("/{id}/status")
    public ResponseEntity<SolicitacaoModel> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        if (solicitacaoService.buscarPorId(id).isEmpty()) return ResponseEntity.notFound().build();

        Status status;
        try { status = Status.valueOf(body.get("status")); }
        catch (Exception e) { return ResponseEntity.badRequest().build(); }

        return ResponseEntity.ok(solicitacaoService.atualizarStatus(
                id, status,
                body.getOrDefault("comentario", ""),
                authentication.getName()));
    }

    @PreAuthorize("hasRole('GESTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (solicitacaoService.buscarPorId(id).isEmpty()) return ResponseEntity.notFound().build();
        solicitacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== PÚBLICA ====================

    /**
     * CORREÇÃO CRÍTICA:
     * Antes: salvava sempre com usuario = NULL porque o frontend
     * não mandava o objeto usuario e o controller ignorava quem estava logado.
     *
     * Agora: se Authentication não for null (usuário logado), o controller
     * busca o UsuarioModel pelo email e vincula à solicitação.
     * Se for anônimo (null), salva sem usuário — comportamento esperado.
     *
     * Resultado: findByUsuarioId() agora encontra as solicitações do cidadão.
     */
    @PostMapping
    public ResponseEntity<SolicitacaoModel> criar(
            @RequestBody SolicitacaoModel solicitacao,
            Authentication authentication) {

        if (authentication != null && authentication.isAuthenticated()) {
            usuarioRepository.findByEmail(authentication.getName())
                    .ifPresent(solicitacao::setUsuario);
        }

        return ResponseEntity.status(201).body(solicitacaoService.criar(solicitacao));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoModel> buscarPorId(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/protocolo/{protocolo}")
    public ResponseEntity<SolicitacaoModel> buscarPorProtocolo(@PathVariable String protocolo) {
        return solicitacaoService.buscarPorProtocolo(protocolo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistoricoStatusModel>> buscarHistorico(@PathVariable Long id) {
        if (solicitacaoService.buscarPorId(id).isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(solicitacaoService.buscarHistorico(id));
    }

    @GetMapping("/publicas")
    public ResponseEntity<List<SolicitacaoModel>> listarPublicas() {
        return ResponseEntity.ok(solicitacaoService.listarPublicas());
    }

    // ==================== CIDADÃO ====================

    @GetMapping("/minhas")
    public ResponseEntity<List<SolicitacaoModel>> minhasSolicitacoes(Authentication auth) {
        return ResponseEntity.ok(solicitacaoService.buscarMinhasSolicitacoes(auth.getName()));
    }

    @GetMapping("/meus-protocolos")
    public ResponseEntity<List<String>> meusProtocolos(Authentication auth) {
        return ResponseEntity.ok(solicitacaoService.buscarMeusProtocolos(auth.getName()));
    }

    @PutMapping("/{id}/confirmar")
    public ResponseEntity<?> confirmarOcorrencia(@PathVariable Long id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated())
            return ResponseEntity.status(401).body(Map.of("mensagem", "Login necessário."));

        try {
            return ResponseEntity.ok(solicitacaoService.confirmarOcorrencia(id, auth.getName()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("mensagem", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("mensagem", e.getMessage()));
        }
    }
}