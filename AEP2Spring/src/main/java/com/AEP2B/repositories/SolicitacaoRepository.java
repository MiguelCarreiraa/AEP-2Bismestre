package com.AEP2B.repositories;

import com.AEP2B.enums.Categoria;
import com.AEP2B.enums.LocalTipo;
import com.AEP2B.enums.Status;
import com.AEP2B.models.SolicitacaoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoRepository extends JpaRepository<SolicitacaoModel, Long> {

    Optional<SolicitacaoModel> findByProtocolo(String protocolo);

    List<SolicitacaoModel> findByStatus(Status status);

    List<SolicitacaoModel> findByStatusNot(Status status);

    List<SolicitacaoModel> findByPrioridade(String prioridade);

    List<SolicitacaoModel> findByLocalTipo(LocalTipo localTipo);

    List<SolicitacaoModel> findByCategoria(Categoria categoria);

    List<SolicitacaoModel> findByEndereco_Bairro(String bairro);

    List<SolicitacaoModel> findByEndereco_BairroContainingIgnoreCase(String bairro);

    List<SolicitacaoModel> findByUsuarioId(Long usuarioId);

    // Filtro combinado para o gestor: status + categoria
    List<SolicitacaoModel> findByStatusAndCategoria(Status status, Categoria categoria);

    @Query("""
       SELECT s.protocolo
       FROM SolicitacaoModel s
       WHERE s.usuario.id = :usuarioId
       """)
    List<String> buscarProtocolosPorUsuario(@Param("usuarioId") Long usuarioId);

    // Busca solicitações do usuário com solicitações criadas por ele
    // (usuario não nulo = solicitações logadas)
    @Query("""
       SELECT s FROM SolicitacaoModel s
       WHERE s.usuario.email = :email
       """)
    List<SolicitacaoModel> findByUsuarioEmail(@Param("email") String email);
}