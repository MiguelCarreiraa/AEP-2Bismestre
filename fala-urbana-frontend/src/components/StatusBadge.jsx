/**
 * Exibe o status colorido da solicitação.
 * Recebe o status como string e aplica a cor correta.
 */
function StatusBadge({ status }) {
  // Mapa de status → cor Bootstrap
  const statusConfig = {
    ABERTO: { color: 'primary', label: 'Aberto' },
    TRIAGEM: { color: 'warning', label: 'Em Triagem' },
    EM_EXECUCAO: { color: 'info', label: 'Em Execução' },
    RESOLVIDO: { color: 'success', label: 'Resolvido' },
    ENCERRADO: { color: 'secondary', label: 'Encerrado' },
  };

  const config = statusConfig[status] || { color: 'secondary', label: status };

  return (
    <span className={`badge bg-${config.color}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;