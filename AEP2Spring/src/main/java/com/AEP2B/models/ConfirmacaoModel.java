package com.AEP2B.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

// ============================================================
// NOVO: ConfirmacaoModel
// Registra QUAL usuário confirmou QUAL solicitação.
// Isso permite:
//   1. Validar no banco se o usuário já confirmou (constraint UNIQUE)
//   2. Impedir duplicatas no nível do banco de dados
//      — não confiamos apenas no frontend.
//
// A constraint unique(usuario_id, solicitacao_id) garante que
// um mesmo par usuário+solicitação não pode ser inserido duas vezes.
// ============================================================
@Entity
@Table(
    name = "TBL_CONFIRMACOES",
    uniqueConstraints = {
        // CONSTRAINT ÚNICA: um usuário só pode confirmar uma solicitação uma vez
        @UniqueConstraint(
            name = "uk_usuario_solicitacao",
            columnNames = {"usuario_id", "solicitacao_id"}
        )
    }
)
public class ConfirmacaoModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "usuario_id", nullable = false)
  private UsuarioModel usuario;

  @ManyToOne
  @JoinColumn(name = "solicitacao_id", nullable = false)
  private SolicitacaoModel solicitacao;

  public ConfirmacaoModel() {
  }

  public ConfirmacaoModel(UsuarioModel usuario, SolicitacaoModel solicitacao) {
    this.usuario = usuario;
    this.solicitacao = solicitacao;
  }

  public Long getId() {
    return id;
  }

  public UsuarioModel getUsuario() {
    return usuario;
  }

  public void setUsuario(UsuarioModel usuario) {
    this.usuario = usuario;
  }

  public SolicitacaoModel getSolicitacao() {
    return solicitacao;
  }

  public void setSolicitacao(SolicitacaoModel solicitacao) {
    this.solicitacao = solicitacao;
  }
}