package com.AEP2B.models;

import com.AEP2B.enums.Status;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

// ============================================================
// ADIÇÃO: @JsonBackReference no campo "solicitacao"
// Isso evita o loop infinito na serialização:
// Solicitacao → historico → solicitacao → historico → infinito...
// Com @JsonManagedReference na SolicitacaoModel e
// @JsonBackReference aqui, o Jackson serializa apenas a direção
// "para frente" (solicitacao → historico), não o caminho de volta.
// ============================================================
@Entity
@Table(name = "TBL_HISTORICO_STATUS")
public class HistoricoStatusModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Status")
  @Enumerated(EnumType.STRING)
  private Status status;

  @Column(name = "Comentario", length = 1000)
  private String comentario;

  @Column(name = "Responsavel")
  private String responsavel;

  @Column(name = "Data")
  private LocalDateTime data;

  @ManyToOne
  @JoinColumn(name = "solicitacao_id")
  @JsonBackReference
  private SolicitacaoModel solicitacao;

  public HistoricoStatusModel() {
    this.data = LocalDateTime.now();
  }

  public HistoricoStatusModel(Status status,
      String comentario,
      String responsavel,
      SolicitacaoModel solicitacao) {
    this.status = status;
    this.comentario = comentario;
    this.responsavel = responsavel;
    this.solicitacao = solicitacao;
    this.data = LocalDateTime.now();
  }

  // Getters e Setters

  public Long getId() {
    return id;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public String getComentario() {
    return comentario;
  }

  public void setComentario(String comentario) {
    this.comentario = comentario;
  }

  public String getResponsavel() {
    return responsavel;
  }

  public void setResponsavel(String responsavel) {
    this.responsavel = responsavel;
  }

  public LocalDateTime getData() {
    return data;
  }

  public void setData(LocalDateTime data) {
    this.data = data;
  }

  public SolicitacaoModel getSolicitacao() {
    return solicitacao;
  }

  public void setSolicitacao(SolicitacaoModel solicitacao) {
    this.solicitacao = solicitacao;
  }
}