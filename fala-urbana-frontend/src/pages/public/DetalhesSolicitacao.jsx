import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import solicitacaoService from '../../services/solicitacaoService';
import { useAuth } from '../../context/AuthContext';

function DetalhesSolicitacao() {
  const { protocolo } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [solicitacao, setSolicitacao] = useState(null);
  const [historico, setHistorico]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [erro, setErro]               = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  // 'idle' | 'confirmado' | 'jaConfirmou' | 'erro'
  const [statusConfirm, setStatus]    = useState('idle');
  const [msgConfirm, setMsg]          = useState('');

  useEffect(() => { carregarDados(); }, [protocolo]);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const sol = await solicitacaoService.buscarPorProtocolo(protocolo);
      setSolicitacao(sol);
      if (sol.historico && sol.historico.length > 0) {
        setHistorico(sol.historico);
      } else {
        try {
          const hist = await solicitacaoService.buscarHistorico(sol.id);
          setHistorico(hist);
        } catch {
          setHistorico([]);
        }
      }
    } catch {
      setErro('Solicitação não encontrada. Verifique o protocolo informado.');
    } finally {
      setLoading(false);
    }
  };

  // Sem try/catch aqui — o service nunca lança exceção no confirmar
  const handleConfirmar = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }

    setConfirmando(true);

    const resultado = await solicitacaoService.confirmarOcorrencia(solicitacao.id);

    if (resultado.ok) {
      setSolicitacao(resultado.data);
      setStatus('confirmado');
      setMsg('✅ Você confirmou este problema!');
    } else if (resultado.jaConfirmou) {
      setStatus('jaConfirmou');
      setMsg('⚠️ Você já confirmou esta solicitação anteriormente.');
    } else {
      setStatus('erro');
      setMsg(resultado.mensagem || 'Erro ao confirmar. Tente novamente.');
    }

    setConfirmando(false);
  };

  const catLabels = {
    ILUMINACAO:'💡 Iluminação', BURACO:'🕳️ Buraco',
    LIMPEZA:'🧹 Limpeza',      SAUDE:'🏥 Saúde',
    SEGURANCA:'🔒 Segurança',  OUTRO:'📌 Outro',
  };
  const localLabels = {
    HOSPITAL:'🏥 Hospital', ESCOLA:'🏫 Escola',
    PRACA:'🌳 Praça', PREFEITURA:'🏛️ Prefeitura',
    RUA:'🛣️ Rua', OUTRO:'📌 Outro',
  };
  const fmt = (d) => d ? new Date(d).toLocaleString('pt-BR') : '—';

  return (
    <Layout>
      <div className="container py-4">

        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <button className="btn btn-link p-0 small" onClick={() => navigate('/')}>Início</button>
            </li>
            <li className="breadcrumb-item active">Detalhes da Solicitação</li>
          </ol>
        </nav>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-2 text-muted">Buscando protocolo {protocolo}...</p>
          </div>
        )}

        {!loading && erro && (
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card p-5 shadow-sm">
                <div className="fs-1 mb-3">🔍</div>
                <h4>Protocolo não encontrado</h4>
                <p className="text-muted">{erro}</p>
                <p className="small text-muted">Protocolo buscado: <code>{protocolo}</code></p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && solicitacao && (
          <div className="row g-4">

            {/* Coluna principal */}
            <div className="col-lg-8">

              <div className="card shadow-sm mb-4">
                <div className="card-header d-flex justify-content-between align-items-center py-3"
                     style={{ backgroundColor: '#f8fafc' }}>
                  <span className="badge bg-secondary font-monospace fs-6">
                    {solicitacao.protocolo}
                  </span>
                  <StatusBadge status={solicitacao.status} />
                </div>
                <div className="card-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <p className="small text-muted fw-semibold mb-1">CATEGORIA</p>
                      <p className="mb-0">{catLabels[solicitacao.categoria] || solicitacao.categoria}</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="small text-muted fw-semibold mb-1">TIPO DE LOCAL</p>
                      <p className="mb-0">
                        {localLabels[solicitacao.localTipo] || solicitacao.localTipo}
                        {solicitacao.localOutro && ` — ${solicitacao.localOutro}`}
                      </p>
                    </div>
                    {solicitacao.prioridade && (
                      <div className="col-sm-6">
                        <p className="small text-muted fw-semibold mb-1">PRIORIDADE</p>
                        <p className="mb-0">
                          {solicitacao.prioridade === 'ALTA'  ? '🔴 Alta'
                          : solicitacao.prioridade === 'MEDIA' ? '🟡 Média'
                          : '🟢 Baixa'}
                        </p>
                      </div>
                    )}
                  </div>
                  <hr />
                  <p className="small text-muted fw-semibold mb-1">DESCRIÇÃO</p>
                  <p className="mb-0">{solicitacao.descricao}</p>
                </div>
              </div>

              {solicitacao.endereco && (
                <div className="card shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3">📍 Endereço</h6>
                    <div className="row g-2">
                      <div className="col-8">
                        <span className="text-muted small">Rua:</span>
                        <p className="mb-0">{solicitacao.endereco.rua}, {solicitacao.endereco.numero}</p>
                      </div>
                      <div className="col-4">
                        <span className="text-muted small">CEP:</span>
                        <p className="mb-0">{solicitacao.endereco.cep}</p>
                      </div>
                      <div className="col-6">
                        <span className="text-muted small">Bairro:</span>
                        <p className="mb-0">{solicitacao.endereco.bairro}</p>
                      </div>
                      {solicitacao.endereco.referencia && (
                        <div className="col-12">
                          <span className="text-muted small">Referência:</span>
                          <p className="mb-0">{solicitacao.endereco.referencia}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">📋 Histórico de Atualizações</h6>
                  {historico.length === 0 ? (
                    <p className="text-muted small">Nenhuma atualização registrada ainda.</p>
                  ) : (
                    <div className="position-relative ps-4">
                      <div style={{
                        position:'absolute', left:'7px', top:4, bottom:4,
                        width:2, backgroundColor:'#e2e8f0',
                      }} />
                      {historico.map((item, idx) => (
                        <div key={item.id || idx} className="position-relative mb-4">
                          <div style={{
                            position:'absolute', left:-22, top:2,
                            width:14, height:14, borderRadius:'50%',
                            backgroundColor:'#2563eb',
                            border:'2px solid #fff', boxShadow:'0 0 0 2px #2563eb',
                          }} />
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <StatusBadge status={item.status} />
                            <span className="text-muted" style={{ fontSize:'0.75rem' }}>
                              {fmt(item.data)}
                            </span>
                          </div>
                          {item.comentario && <p className="mb-0 small">{item.comentario}</p>}
                          {item.responsavel && (
                            <p className="mb-0" style={{ fontSize:'0.72rem', color:'#94a3b8' }}>
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

            {/* Coluna lateral */}
            <div className="col-lg-4">

              <div className="card shadow-sm mb-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 fw-bold text-primary mb-1">
                    {solicitacao.confirmacoes ?? 0}
                  </div>
                  <p className="text-muted mb-3">cidadão(s) confirmaram este problema</p>

                  {statusConfirm === 'idle' && (
                    <>
                      <button
                        className="btn btn-success w-100 mb-2"
                        onClick={handleConfirmar}
                        disabled={confirmando}>
                        {confirmando
                          ? <><span className="spinner-border spinner-border-sm me-2" />Confirmando...</>
                          : '👍 Confirmar Solicitação'}
                      </button>
                      {!isAuthenticated() && (
                        <p className="small text-muted mb-0">
                          <Link to="/login">Faça login</Link> para confirmar.
                        </p>
                      )}
                    </>
                  )}

                  {statusConfirm === 'confirmado' && (
                    <div className="alert alert-success py-2 mb-0 fw-semibold">
                      {msgConfirm}
                    </div>
                  )}

                  {statusConfirm === 'jaConfirmou' && (
                    <div className="alert alert-warning py-2 mb-0 fw-semibold">
                      {msgConfirm}
                    </div>
                  )}

                  {statusConfirm === 'erro' && (
                    <div className="alert alert-danger py-2 mb-2">
                      {msgConfirm}
                      <br />
                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => setStatus('idle')}>
                        Tentar novamente
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">Ações</h6>
                  <div className="d-flex flex-column gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate('/')}>
                      ← Buscar outro protocolo
                    </button>
                    <Link to="/nova-solicitacao" className="btn btn-outline-primary btn-sm">
                      + Criar nova solicitação
                    </Link>
                    <Link to="/confirmar-solicitacoes" className="btn btn-outline-success btn-sm">
                      ✅ Ver todas as solicitações
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DetalhesSolicitacao;