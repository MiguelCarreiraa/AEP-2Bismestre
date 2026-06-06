package com.AEP2B.models;

import com.AEP2B.enums.TipoUsuario;
import jakarta.persistence.*;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Entity
@Table(name = "TBL_USUARIOS")
public class UsuarioModel implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "Nome Usuario")
    private String nome;
    @Column(name = "CPF Usuario")
    private String cpf;
    @Column(name = "Email Usuario")
    private String email;
    @Column(name = "Senha Usuario")
    private String senha;

    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo;

    public UsuarioModel() {
    }

    public UsuarioModel(Long id,
                   String nome,
                   String cpf,
                   String email,
                   String senha,
                   TipoUsuario tipo) {

        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }


    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }


    public boolean isAnonimo() {
        return tipo == TipoUsuario.ROLE_ANONIMO;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(tipo == TipoUsuario.ROLE_GESTOR){
            return List.of(
                    new SimpleGrantedAuthority("ROLE_GESTOR"),
                    new SimpleGrantedAuthority("ROLE_CIDADAO")
            );
        }

        return List.of(
                new SimpleGrantedAuthority("ROLE_CIDADAO")
        );
    }

    @Override
    public @Nullable String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
