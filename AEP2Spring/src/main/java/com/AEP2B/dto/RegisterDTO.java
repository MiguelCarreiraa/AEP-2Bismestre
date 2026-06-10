package com.AEP2B.dto;

import com.AEP2B.enums.TipoUsuario;

public record RegisterDTO(
    String nome,
    String cpf,
    String email,
    String senha,
    TipoUsuario tipo
) {

}