package com.AEP2B.services;

import com.AEP2B.models.UsuarioModel;
import com.AEP2B.repositories.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Autowired
  private PasswordEncoder encoder;

  public UsuarioModel cadastrarUsuario(UsuarioModel usuario) {

    if (usuarioRepository.existsByEmail(usuario.getEmail())) {
      throw new RuntimeException("Email já cadastrado");
    }

    usuario.setSenha(
        encoder.encode(usuario.getSenha())
    );

    return usuarioRepository.save(usuario);
  }

  public List<UsuarioModel> listarTodosUsuarios() {
    return usuarioRepository.findAll();
  }

  public Optional<UsuarioModel> buscarPorId(Long id) {
    return usuarioRepository.findById(id);
  }

  public UsuarioModel atualizar(Long id, UsuarioModel usuario) {

    UsuarioModel model =
        usuarioRepository.findById(id).get();

    model.setNome(usuario.getNome());
    model.setCpf(usuario.getCpf());
    model.setEmail(usuario.getEmail());
    model.setSenha(usuario.getSenha());
    model.setTipo(usuario.getTipo());

    return usuarioRepository.save(model);
  }

  public void deletar(Long id) {
    usuarioRepository.deleteById(id);
  }

}
