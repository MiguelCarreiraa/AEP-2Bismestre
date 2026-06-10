package com.AEP2B.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TBL_ENDERECOS")
public class EnderecoModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "Rua Endereco")
  private String rua;

  @Column(name = "Numero Endereco")
  private String numero;

  @Column(name = "CEP Endereco")
  private String cep;

  @Column(name = "Bairro Endereco")
  private String bairro;

  @Column(name = "Referencia Endereco")
  private String referencia;

  public EnderecoModel() {
  }

  public EnderecoModel(String rua,
      String numero,
      String cep,
      String bairro,
      String referencia) {

    this.rua = rua;
    this.numero = numero;
    this.cep = cep;
    this.bairro = bairro;
    this.referencia = referencia;
  }

  public Long getId() {
    return id;
  }

  public String getRua() {
    return rua;
  }

  public void setRua(String rua) {
    this.rua = rua;
  }

  public String getNumero() {
    return numero;
  }

  public void setNumero(String numero) {
    this.numero = numero;
  }

  public String getCep() {
    return cep;
  }

  public void setCep(String cep) {
    this.cep = cep;
  }

  public String getBairro() {
    return bairro;
  }

  public void setBairro(String bairro) {
    this.bairro = bairro;
  }

  public String getReferencia() {
    return referencia;
  }

  public void setReferencia(String referencia) {
    this.referencia = referencia;
  }

  @Override
  public String toString() {

    String base = rua + ", " + numero + " - " + bairro;

    if (cep != null && !cep.isBlank()) {
      base += " | CEP: " + cep;
    }

    if (referencia != null && !referencia.isBlank()) {
      base += " | Ref: " + referencia;
    }

    return base;
  }
}
