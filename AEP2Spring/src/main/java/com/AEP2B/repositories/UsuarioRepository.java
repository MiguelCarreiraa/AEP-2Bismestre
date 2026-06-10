package com.AEP2B.repositories;

import com.AEP2B.models.UsuarioModel;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

  Optional<UsuarioModel> findByEmail(String email);

  boolean existsByEmail(String email);
}
