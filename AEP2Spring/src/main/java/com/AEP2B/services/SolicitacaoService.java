package com.AEP2B.services;

import com.AEP2B.enums.Categoria;
import com.AEP2B.enums.LocalTipo;
import com.AEP2B.enums.Status;
import com.AEP2B.models.ConfirmacaoModel;
import com.AEP2B.models.HistoricoStatusModel;
import com.AEP2B.models.SolicitacaoModel;
import com.AEP2B.models.UsuarioModel;
import com.AEP2B.repositories.ConfirmacaoRepository;
import com.AEP2B.repositories.HistoricoRepository;
import com.AEP2B.repositories.SolicitacaoRepository;
import com.AEP2B.repositories.UsuarioRepository;
import com.AEP2B.utils.GeradorProtocolo;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolicitacaoService {

  @Autowired
  private UsuarioRepository usuarioRepository;
  @Autowired
  private SolicitacaoRepository solicitacaoRepository;
  @Autowired
  private HistoricoRepository historicoRepository;
  @Autowired
  private ConfirmacaoRepository confirmacaoRepository;

  public List<SolicitacaoModel> listarTodas() {
    return solicitacaoRepository.findAll();
  }

  public List<SolicitacaoModel> listarPublicas() {
    return solicitacaoRepository.findByStatusNot(Status.ENCERRADO);
  }

  public SolicitacaoModel criar(SolicitacaoModel solicitacao) {
    solicitacao.setProtocolo(GeradorProtocolo.gerar(8));
    solicitacao.setStatus(Status.ABERTO);
    solicitacao.setConfirmacoes(0);

    SolicitacaoModel salva = solicitacaoRepository.save(solicitacao);

    HistoricoStatusModel hist = new HistoricoStatusModel(
        Status.ABERTO, "Solicitação registrada no sistema.", "Sistema", salva);
    historicoRepository.save(hist);

    return salva;
  }

  public Optional<SolicitacaoModel> buscarPorId(Long id) {
    return solicitacaoRepository.findById(id);
  }

  public Optional<SolicitacaoModel> buscarPorProtocolo(String protocolo) {
    return solicitacaoRepository.findByProtocolo(protocolo);
  }

  public List<SolicitacaoModel> buscarPorStatus(Status status) {
    return solicitacaoRepository.findByStatus(status);
  }

  public List<SolicitacaoModel> buscarPorCategoria(Categoria categoria) {
    return solicitacaoRepository.findByCategoria(categoria);
  }

  public List<SolicitacaoModel> buscarPorPrioridade(String prioridade) {
    return solicitacaoRepository.findByPrioridade(prioridade);
  }

  public List<SolicitacaoModel> buscarPorLocal(LocalTipo localTipo) {
    return solicitacaoRepository.findByLocalTipo(localTipo);
  }

  public List<SolicitacaoModel> buscarPorBairro(String bairro) {
    return solicitacaoRepository.findByEndereco_BairroContainingIgnoreCase(bairro);
  }

  public SolicitacaoModel atualizar(Long id, SolicitacaoModel novaSolicitacao) {
    SolicitacaoModel model = solicitacaoRepository.findById(id).orElseThrow();
    model.setDescricao(novaSolicitacao.getDescricao());
    model.setCategoria(novaSolicitacao.getCategoria());
    model.setLocalTipo(novaSolicitacao.getLocalTipo());
    model.setEndereco(novaSolicitacao.getEndereco());
    return solicitacaoRepository.save(model);
  }

  public SolicitacaoModel atualizarStatus(Long id, Status status,
      String comentario, String responsavel) {
    SolicitacaoModel model = solicitacaoRepository.findById(id).orElseThrow();
    model.setStatus(status);
    SolicitacaoModel salva = solicitacaoRepository.save(model);

    String texto = (comentario != null && !comentario.isBlank())
        ? comentario : "Status atualizado para " + status.name();

    historicoRepository.save(
        new HistoricoStatusModel(status, texto, responsavel, salva)
    );
    return salva;
  }

  // ============================================================
  // CORRIGIDO: confirmarOcorrencia agora valida duplicatas no banco.
  // Lança RuntimeException se o usuário já confirmou.
  // O controller trata essa exceção e retorna 409 Conflict.
  // ============================================================
  public SolicitacaoModel confirmarOcorrencia(Long solicitacaoId, String emailUsuario) {
    SolicitacaoModel solicitacao = solicitacaoRepository.findById(solicitacaoId)
        .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

    UsuarioModel usuario = usuarioRepository.findByEmail(emailUsuario)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    // Validação de duplicata no banco
    boolean jaConfirmou = confirmacaoRepository
        .existsByUsuarioIdAndSolicitacaoId(usuario.getId(), solicitacaoId);

    if (jaConfirmou) {
      throw new IllegalStateException("Você já confirmou esta solicitação.");
    }

    // Registra a confirmação
    confirmacaoRepository.save(new ConfirmacaoModel(usuario, solicitacao));

    // Incrementa o contador
    solicitacao.setConfirmacoes(solicitacao.getConfirmacoes() + 1);
    return solicitacaoRepository.save(solicitacao);
  }

  public void deletar(Long id) {
    solicitacaoRepository.deleteById(id);
  }

  // ============================================================
  // CORRIGIDO: usa query por email diretamente — mais confiável
  // que buscar por usuarioId quando o vínculo pode ser nulo.
  // ============================================================
  public List<SolicitacaoModel> buscarMinhasSolicitacoes(String email) {
    return solicitacaoRepository.findByUsuarioEmail(email);
  }

  public List<String> buscarMeusProtocolos(String email) {
    UsuarioModel usuario = usuarioRepository.findByEmail(email).orElseThrow();
    return solicitacaoRepository.buscarProtocolosPorUsuario(usuario.getId());
  }

  public List<HistoricoStatusModel> buscarHistorico(Long solicitacaoId) {
    return historicoRepository.findBySolicitacaoIdOrderByDataDesc(solicitacaoId);
  }
}