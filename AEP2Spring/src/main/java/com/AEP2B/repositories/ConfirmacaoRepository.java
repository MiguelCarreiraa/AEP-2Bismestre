package com.AEP2B.repositories;

import com.AEP2B.models.ConfirmacaoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmacaoRepository extends JpaRepository<ConfirmacaoModel, Long> {

  // Verifica se usuário já confirmou esta solicitação
  boolean existsByUsuarioIdAndSolicitacaoId(Long usuarioId, Long solicitacaoId);
}