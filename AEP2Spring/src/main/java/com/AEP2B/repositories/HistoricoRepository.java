package com.AEP2B.repositories;

import com.AEP2B.models.HistoricoStatusModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// NOVO ARQUIVO — estava sendo referenciado pelo SolicitacaoService
// mas não existia no projeto.
@Repository
public interface HistoricoRepository extends JpaRepository<HistoricoStatusModel, Long> {

    // Busca todo o histórico de uma solicitação, do mais recente ao mais antigo
    List<HistoricoStatusModel> findBySolicitacaoIdOrderByDataDesc(Long solicitacaoId);
}