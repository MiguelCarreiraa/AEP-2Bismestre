package com.AEP2B.models;

import com.AEP2B.enums.Categoria;
import com.AEP2B.enums.LocalTipo;
import com.AEP2B.enums.Status;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

// ============================================================
// ADIÇÃO: Relacionamento @OneToMany com HistoricoStatusModel
// Isso permite que ao buscar uma solicitação, o histórico
// (incluindo comentários do gestor) seja retornado junto.
// cascade = ALL → salvar/deletar solicitação afeta o histórico.
// fetch = LAZY → histórico só é carregado quando acessado.
// @JsonManagedReference → evita loop infinito na serialização JSON.
// ============================================================
@Entity
@Table(name = "TBL_SOLICITACAOS")
public class SolicitacaoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Numero Protocolo Solicitacao")
    private String protocolo;

    @Column(name = "Descricao Solicitacao")
    private String descricao;

    @Column(name = "Categoria Solicitacao")
    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    @Column(name = "Tipo Local Solicitacao")
    @Enumerated(EnumType.STRING)
    private LocalTipo localTipo;

    @Column(name = "Outro Local Solicitacao")
    private String localOutro;

    @Column(name = "Prioridade Solicitacao")
    private String prioridade;

    @Column(name = "Numero Confirmacoes Solicitacao")
    private Integer confirmacoes;

    @Column(name = "Status Solicitacao")
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel usuario;

    @JoinColumn(name = "endereco_id")
    @OneToOne(cascade = CascadeType.ALL)
    private EnderecoModel endereco;

    // NOVO: lista de histórico vinculada a esta solicitação
    // mappedBy = "solicitacao" refere ao campo em HistoricoStatusModel
    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @OrderBy("data DESC")
    private List<HistoricoStatusModel> historico = new ArrayList<>();

    public SolicitacaoModel() {
    }

    // --- Getters e Setters ---

    public Long getId() { return id; }

    public String getProtocolo() { return protocolo; }
    public void setProtocolo(String protocolo) { this.protocolo = protocolo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public LocalTipo getLocalTipo() { return localTipo; }
    public void setLocalTipo(LocalTipo localTipo) { this.localTipo = localTipo; }

    public String getLocalOutro() { return localOutro; }
    public void setLocalOutro(String localOutro) { this.localOutro = localOutro; }

    public String getPrioridade() { return prioridade; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }

    public Integer getConfirmacoes() { return confirmacoes; }
    public void setConfirmacoes(Integer confirmacoes) { this.confirmacoes = confirmacoes; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public UsuarioModel getUsuario() { return usuario; }
    public void setUsuario(UsuarioModel usuario) { this.usuario = usuario; }

    public EnderecoModel getEndereco() { return endereco; }
    public void setEndereco(EnderecoModel endereco) { this.endereco = endereco; }

    public List<HistoricoStatusModel> getHistorico() { return historico; }
    public void setHistorico(List<HistoricoStatusModel> historico) { this.historico = historico; }
}