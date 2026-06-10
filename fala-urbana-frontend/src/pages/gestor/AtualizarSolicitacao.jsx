import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GestorLayout from '../../components/GestorLayout';
import StatusBadge from '../../components/StatusBadge';
import solicitacaoService from '../../services/solicitacaoService';

// ============================================================
// MODIFICADO: Adicionada busca por protocolo no topo.
// O gestor pode digitar um protocolo e localizar a solicitação
// sem precisar navegar para a listagem.
// ============================================================
function AtualizarSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Busca por protocolo
  const [buscarProtocolo, setBuscarProtocolo] = useState('');
  const [buscando, setBuscando]               = useState(false);
  const [erroBusca, setErroBusca]             = useState('');

  // Dados da solicitação
  const [solicitacao, setSolicitacao] = useState(null);
  const [historico, setHistorico]     = useState([]);
  const [novoStatus, setNovoStatus]   = useState('ABERTO');
  const [novaPrioridade, setNovaPrio] = useState('MEDIA');
  const [comentario, setComentario]   = useState('');
  const [loading, setLoading]         = useState(!!id);
  const [salvando, setSalvando]       = useState(false);
  const [sucesso, setSucesso]         = useState(false);
  const [erro, setErro]               = useState('');

  const sugestoes = [
    'Equipe enviada ao local.',
    'Solicitação encaminhada ao setor responsável.',
    'Aguardando materiais para execução.',
    'Serviço em andamento.',
    'Serviço concluído com sucesso.',
    'Solicitação encerrada por duplicidade.',
  ];

  useEffect(() => {
    if (id) carregarPorId(id);
  }, [id]);

  const carregarPorId = async (solId) => {
    setLoading(true); setErro('');
    try {
      const sol = await solicitacaoService.buscarPorId(solId);
      carregarSolicitacao(sol);
      try {
        const hist = sol.historico?.length > 0
          ? sol.historico
          : await solicitacaoService.buscarHistorico(solId);
        setHistorico(hist);
      } catch { setHistorico([]); }
    } catch {
      setErro('Erro ao carregar solicitação.');
    } finally { setLoading(false); }
  };

  const carregarSolicitacao = (sol) => {
    setSolicitacao(sol);
    setNovoStatus(sol.status);
    setNovaPrio(sol.prioridade || 'MEDIA');
    setComentario('');
  };

  const handleBuscarProtocolo = async (e) => {
    e.preventDefault();
    if (!buscarProtocolo.trim()) return;
    setBuscando(true); setErroBusca('');
    try {
      const sol = await solicitacaoService.buscarPorProtocolo(buscarProtocolo.trim());
      carregarSolicitacao(sol);
      // Carrega o histórico
      try {
        const hist = sol.historico?.length > 0
          ? sol.historico
          : await solicitacaoService.buscarHistorico(sol.id);
        setHistorico(hist);
      } catch { setHistorico([]); }
      // Atualiza a URL sem recarregar
      navigate(`/gestor/solicitacao/${sol.id}`, { replace: true });
    } catch {
      setErroBusca('Protocolo não encontrado.');
      setSolicitacao(null);
    } finally { setBuscando(false); }
  };

  const handleSalvar = async () => {
    if (!comentario.trim()) { setErro('Insira um comentário.'); return; }
    setErro(''); setSalvando(true);
    try {
      await solicitacaoService.atualizarStatus(solicitacao.id, novoStatus, comentario);
      setSucesso(true);
      setTimeout(() => navigate('/gestor/solicitacoes'), 1800);
    } catch {
      setErro('Erro ao atualizar. Verifique se o backend está rodando.');
    } finally { setSalvando(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleString('pt-BR') : '—';

  const catLabels = {
    ILUMINACAO:'💡 Iluminação', BURACO:'🕳️ Buraco',
    LIMPEZA:'🧹 Limpeza', SAUDE:'🏥 Saúde',
    SEGURANCA:'🔒 Segurança', OUTRO:'📌 Outro',
  };

  return (
    <GestorLayout>

      {/* ===== BUSCA POR PROTOCOLO ===== */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-3">
          <h6 className="fw-bold mb-2">🔍 Localizar solicitação por protocolo</h6>
          <form className="d-flex gap-2" onSubmit={handleBuscarProtocolo}>
            <input
              type="text"
              className={`form-control form-control-sm ${erroBusca ? 'is-invalid' : ''}`}
              style={{ maxWidth: 260 }}
              placeholder="Ex: ABCD1234"
              value={buscarProtocolo}
              onChange={e => { setBuscarProtocolo(e.target.value); setErroBusca(''); }}
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={buscando}>
              {buscando ? <span className="spinner-border spinner-border-sm" /> : 'Buscar'}
            </button>
            {solicitacao && (
              <button type="button" className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate('/gestor/solicitacoes')}>
                ← Voltar à listagem
              </button>
            )}
          </form>
          {erroBusca && <div className="text-danger small mt-1">{erroBusca}</div>}
        </div>
      </div>

      {/* ===== SEM SOLICITAÇÃO SELECIONADA ===== */}
      {!loading && !solicitacao && !erroBusca && (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">Digite um protocolo acima para localizar uma solicitação.</p>
          <p className="small">Ou acesse a listagem e clique em "Ver Detalhes" em qualquer card.</p>
          <button className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate('/gestor/solicitacoes')}>
            Ir para Listagem
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {/* ===== FORMULÁRIO DE ATUALIZAÇÃO ===== */}
      {!loading && solicitacao && (
        <div className="row g-4">

          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Atualizar Solicitação</h5>
              <button className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate(-1)}>
                ← Voltar
              </button>
            </div>

            {sucesso && <div className="alert alert-success">✅ Atualizado! Redirecionando...</div>}
            {erro && <div className="alert alert-danger">{erro}</div>}

            {/* Dados */}
            <div className="card shadow-sm mb-4">
              <div className="card-header d-flex justify-content-between align-items-center"
                   style={{ backgroundColor: '#f8fafc' }}>
                <span className="badge bg-secondary font-monospace">{solicitacao.protocolo}</span>
                <StatusBadge status={solicitacao.status} />
              </div>
              <div className="card-body">
                <div className="row g-2 mb-1">
                  <div className="col-6">
                    <span className="small text-muted">Categoria:</span>
                    <p className="mb-0 small">{catLabels[solicitacao.categoria] || solicitacao.categoria}</p>
                  </div>
                  <div className="col-6">
                    <span className="small text-muted">Local:</span>
                    <p className="mb-0 small">{solicitacao.localTipo}</p>
                  </div>
                </div>
                <span className="small text-muted">Descrição:</span>
                <p className="mb-0 small">{solicitacao.descricao}</p>
                {solicitacao.endereco && (
                  <p className="mb-0 small text-muted mt-1">
                    📍 {solicitacao.endereco.bairro}, {solicitacao.endereco.rua}
                  </p>
                )}
                <p className="mb-0 small text-primary mt-1">
                  👥 {solicitacao.confirmacoes ?? 0} confirmação(s)
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Registrar Atualização</h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Novo Status</label>
                  <select className="form-select" value={novoStatus}
                          onChange={e => setNovoStatus(e.target.value)}>
                    <option value="ABERTO">Aberto</option>
                    <option value="TRIAGEM">Em Triagem</option>
                    <option value="EM_EXECUCAO">Em Execução</option>
                    <option value="RESOLVIDO">Resolvido</option>
                    <option value="ENCERRADO">Encerrado</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Prioridade</label>
                  <select className="form-select" value={novaPrioridade}
                          onChange={e => setNovaPrio(e.target.value)}>
                    <option value="BAIXA">🟢 Baixa</option>
                    <option value="MEDIA">🟡 Média</option>
                    <option value="ALTA">🔴 Alta</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Comentário * <span className="text-muted fw-normal small">(obrigatório)</span>
                  </label>
                  <textarea className="form-control" rows={3}
                    placeholder="Descreva a ação tomada..."
                    value={comentario}
                    onChange={e => setComentario(e.target.value)} />
                  <div className="mt-2 d-flex flex-wrap gap-1">
                    {sugestoes.map(s => (
                      <button key={s} type="button"
                        className="btn btn-outline-secondary btn-sm"
                        style={{ fontSize: '0.71rem' }}
                        onClick={() => setComentario(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary w-100 fw-semibold"
                        onClick={handleSalvar}
                        disabled={salvando || !comentario.trim()}>
                  {salvando
                    ? <><span className="spinner-border spinner-border-sm me-2" />Salvando...</>
                    : 'Salvar Atualização'}
                </button>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">📋 Histórico desta Solicitação</h6>
                {historico.length === 0 ? (
                  <p className="text-muted small">Nenhuma atualização registrada ainda.</p>
                ) : (
                  <div className="position-relative ps-4">
                    <div style={{ position:'absolute', left:'7px', top:4, bottom:4, width:2, backgroundColor:'#e2e8f0' }} />
                    {historico.map((item, idx) => (
                      <div key={item.id || idx} className="position-relative mb-4">
                        <div style={{
                          position:'absolute', left:-22, top:2, width:14, height:14,
                          borderRadius:'50%', backgroundColor:'#2563eb',
                          border:'2px solid #fff', boxShadow:'0 0 0 2px #2563eb',
                        }} />
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <StatusBadge status={item.status} />
                          <span className="text-muted" style={{ fontSize:'0.72rem' }}>
                            {fmt(item.data)}
                          </span>
                        </div>
                        {item.comentario && <p className="mb-0 small">{item.comentario}</p>}
                        {item.responsavel && (
                          <p className="mb-0" style={{ fontSize:'0.7rem', color:'#94a3b8' }}>
                            por {item.responsavel}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </GestorLayout>
  );
}

export default AtualizarSolicitacao;