import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GestorLayout from '../../components/GestorLayout';
import SolicitacaoCard from '../../components/SolicitacaoCard';
import solicitacaoService from '../../services/solicitacaoService';

const POR_PAGINA = 4;

function ListarSolicitacoes() {
  const navigate = useNavigate();
  const [todas, setTodas]     = useState([]);   // lista completa carregada uma vez
  const [visiveis, setVisiveis] = useState([]);  // lista após filtros client-side
  const [loading, setLoading] = useState(true);
  const [erro, setErro]       = useState(null);
  const [paginaAtual, setPag] = useState(1);

  const [filtros, setFiltros] = useState({
    protocolo: '',
    status:    '',
    categoria: '',
    bairro:    '',
    localTipo: '',
  });

  // Carrega tudo uma vez e aplica filtros no client
  useEffect(() => { carregarTodas(); }, []);

  useEffect(() => { aplicarFiltros(); }, [filtros, todas]);

  const carregarTodas = async () => {
    setLoading(true); setErro(null);
    try {
      const dados = await solicitacaoService.listarTodas();
      setTodas(dados);
    } catch {
      setErro('Erro ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...todas];

    if (filtros.protocolo.trim()) {
      resultado = resultado.filter(s =>
        s.protocolo?.toLowerCase().includes(filtros.protocolo.toLowerCase())
      );
    }
    if (filtros.status) {
      resultado = resultado.filter(s => s.status === filtros.status);
    }
    if (filtros.categoria) {
      resultado = resultado.filter(s => s.categoria === filtros.categoria);
    }
    if (filtros.bairro.trim()) {
      resultado = resultado.filter(s =>
        s.endereco?.bairro?.toLowerCase().includes(filtros.bairro.toLowerCase())
      );
    }
    if (filtros.localTipo) {
      resultado = resultado.filter(s => s.localTipo === filtros.localTipo);
    }

    setVisiveis(resultado);
    setPag(1);
  };

  const limpar = () => setFiltros({ protocolo: '', status: '', categoria: '', bairro: '', localTipo: '' });
  const temFiltro = Object.values(filtros).some(v => v !== '');

  const totalPag = Math.ceil(visiveis.length / POR_PAGINA);
  const paginadas = visiveis.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  return (
    <GestorLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold mb-0">Listar Solicitações</h5>
          <p className="text-muted small mb-0">
            {loading ? '...' : `${visiveis.length} de ${todas.length} solicitação(ões)`}
            {temFiltro && <span className="ms-2 badge bg-primary">Filtro ativo</span>}
          </p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={carregarTodas}>
          🔄 Atualizar
        </button>
      </div>

      {/* Painel de filtros — sempre visível */}
      <div className="card border shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">

            <div className="col-md-3">
              <label className="form-label small fw-semibold mb-1">🔍 Protocolo</label>
              <input type="text" className="form-control form-control-sm"
                placeholder="Digite o protocolo..."
                value={filtros.protocolo}
                onChange={e => setFiltros(f => ({ ...f, protocolo: e.target.value }))} />
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold mb-1">Status</label>
              <select className="form-select form-select-sm"
                value={filtros.status}
                onChange={e => setFiltros(f => ({ ...f, status: e.target.value }))}>
                <option value="">Todos</option>
                <option value="ABERTO">Aberto</option>
                <option value="TRIAGEM">Em Triagem</option>
                <option value="EM_EXECUCAO">Em Execução</option>
                <option value="RESOLVIDO">Resolvido</option>
                <option value="ENCERRADO">Encerrado</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold mb-1">Categoria</label>
              <select className="form-select form-select-sm"
                value={filtros.categoria}
                onChange={e => setFiltros(f => ({ ...f, categoria: e.target.value }))}>
                <option value="">Todas</option>
                <option value="ILUMINACAO">💡 Iluminação</option>
                <option value="BURACO">🕳️ Buraco</option>
                <option value="LIMPEZA">🧹 Limpeza</option>
                <option value="SAUDE">🏥 Saúde</option>
                <option value="SEGURANCA">🔒 Segurança</option>
                <option value="OUTRO">📌 Outro</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold mb-1">Bairro</label>
              <input type="text" className="form-control form-control-sm"
                placeholder="Bairro..."
                value={filtros.bairro}
                onChange={e => setFiltros(f => ({ ...f, bairro: e.target.value }))} />
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold mb-1">Tipo de Local</label>
              <select className="form-select form-select-sm"
                value={filtros.localTipo}
                onChange={e => setFiltros(f => ({ ...f, localTipo: e.target.value }))}>
                <option value="">Todos</option>
                <option value="HOSPITAL">🏥 Hospital</option>
                <option value="ESCOLA">🏫 Escola</option>
                <option value="PRACA">🌳 Praça</option>
                <option value="PREFEITURA">🏛️ Prefeitura</option>
                <option value="RUA">🛣️ Rua</option>
                <option value="OUTRO">📌 Outro</option>
              </select>
            </div>

            <div className="col-md-1 d-flex align-items-end">
              {temFiltro && (
                <button className="btn btn-outline-secondary btn-sm w-100" onClick={limpar}>
                  ✕
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="card shadow-sm">
        <div className="card-body p-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : erro ? (
            <div className="alert alert-danger">{erro}</div>
          ) : visiveis.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Nenhuma solicitação encontrada com esses filtros.</p>
              {temFiltro && (
                <button className="btn btn-outline-secondary btn-sm" onClick={limpar}>
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="row g-3">
                {paginadas.map(sol => (
                  <div key={sol.id} className="col-md-6">
                    <SolicitacaoCard
                      solicitacao={sol}
                      linkTo={`/gestor/solicitacao/${sol.id}`}
                    />
                  </div>
                ))}
              </div>

              {totalPag > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPag(1)}>«</button>
                    </li>
                    <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPag(p => p - 1)}>‹</button>
                    </li>
                    {Array.from({ length: Math.min(totalPag, 7) }, (_, i) => i + 1).map(n => (
                      <li key={n} className={`page-item ${paginaAtual === n ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPag(n)}>{n}</button>
                      </li>
                    ))}
                    {totalPag > 7 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                    <li className={`page-item ${paginaAtual === totalPag ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPag(p => p + 1)}>›</button>
                    </li>
                    <li className={`page-item ${paginaAtual === totalPag ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPag(totalPag)}>»</button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </GestorLayout>
  );
}

export default ListarSolicitacoes;