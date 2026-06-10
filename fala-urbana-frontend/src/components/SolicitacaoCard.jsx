import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

/**
 * Card de solicitação — usado tanto no painel do cidadão
 * quanto no painel do gestor.
 * 
 * Props:
 * - solicitacao: objeto com os dados
 * - linkTo: rota de destino ao clicar
 */
function SolicitacaoCard({ solicitacao, linkTo }) {
  const categoriaLabels = {
    ILUMINACAO: '💡 Iluminação',
    BURACO: '🕳️ Buraco',
    LIMPEZA: '🧹 Limpeza',
    SAUDE: '🏥 Saúde',
    SEGURANCA: '🔒 Segurança',
    OUTRO: '📌 Outro',
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow">
      <div className="card-body">
        
        {/* Cabeçalho com protocolo e status */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-secondary font-monospace">
            {solicitacao.protocolo}
          </span>
          <StatusBadge status={solicitacao.status} />
        </div>

        {/* Categoria */}
        <p className="card-text text-muted small mb-1">
          {categoriaLabels[solicitacao.categoria] || solicitacao.categoria}
        </p>

        {/* Descrição (truncada) */}
        <p className="card-text" style={{
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {solicitacao.descricao}
        </p>

        {/* Endereço */}
        {solicitacao.endereco && (
          <p className="card-text text-muted small">
            📍 {solicitacao.endereco.bairro}, {solicitacao.endereco.rua}
          </p>
        )}

      </div>

      {/* Rodapé com link */}
      {linkTo && (
        <div className="card-footer bg-transparent">
          <Link to={linkTo} className="btn btn-outline-primary btn-sm w-100">
            Ver Detalhes
          </Link>
        </div>
      )}
    </div>
  );
}

export default SolicitacaoCard;