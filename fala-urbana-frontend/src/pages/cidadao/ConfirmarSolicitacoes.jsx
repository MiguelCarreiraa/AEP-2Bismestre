import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import solicitacaoService from '../../services/solicitacaoService';
import { useAuth } from '../../context/AuthContext';

function ConfirmarSolicitacoes() {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [solicitacoes, setSolicita] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusConfirm, setStatus] = useState({});

  const [filtros, setFiltros] = useState({
    protocolo: '',
    bairro: '',
    categoria: '',
    status: '',
    localTipo: ''
  });

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, solicitacoes]);

  const carregar = async () => {
    setLoading(true);

    try {
      const dados = await solicitacaoService.listarPublicas();
      setSolicita(dados);
    } catch (error) {
      console.error('Erro ao carregar solicitações', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {

    let resultado = [...solicitacoes];

    if (filtros.protocolo.trim()) {
      resultado = resultado.filter(s =>
        s.protocolo?.toLowerCase()
          .includes(filtros.protocolo.toLowerCase())
      );
    }

    if (filtros.bairro.trim()) {
      resultado = resultado.filter(s =>
        s.endereco?.bairro?.toLowerCase()
          .includes(filtros.bairro.toLowerCase())
      );
    }

    if (filtros.categoria) {
      resultado = resultado.filter(
        s => s.categoria === filtros.categoria
      );
    }

    if (filtros.status) {
      resultado = resultado.filter(
        s => s.status === filtros.status
      );
    }

    if (filtros.localTipo) {
      resultado = resultado.filter(
        s => s.localTipo === filtros.localTipo
      );
    }

    setFiltradas(resultado);
  };

  const limparFiltros = () => {
    setFiltros({
      protocolo: '',
      bairro: '',
      categoria: '',
      status: '',
      localTipo: ''
    });
  };

  const handleConfirmar = async (sol) => {

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setStatus(prev => ({
      ...prev,
      [sol.id]: 'confirmando'
    }));

    const resultado =
      await solicitacaoService.confirmarOcorrencia(sol.id);

    if (resultado.ok) {

      setSolicita(prev =>
        prev.map(item =>
          item.id === sol.id
            ? resultado.data
            : item
        )
      );

      setStatus(prev => ({
        ...prev,
        [sol.id]: 'confirmado'
      }));

    } else if (resultado.jaConfirmou) {

      setStatus(prev => ({
        ...prev,
        [sol.id]: 'jaConfirmou'
      }));
    }
  };

  const temFiltro =
    filtros.protocolo ||
    filtros.bairro ||
    filtros.categoria ||
    filtros.status ||
    filtros.localTipo;

  const catLabels = {
    ILUMINACAO: '💡 Iluminação',
    BURACO: '🕳️ Buraco',
    LIMPEZA: '🧹 Limpeza',
    SAUDE: '🏥 Saúde',
    SEGURANCA: '🔒 Segurança',
    OUTRO: '📌 Outro'
  };

  return (
    <Layout>

      <div className="container py-4">

        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            ✅ Confirmar Solicitações
          </h2>

          <p className="text-muted">
            Confirme problemas que você também presencia.
          </p>
        </div>

        {/* FILTROS */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-3">
                <label className="form-label">
                  Protocolo
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o protocolo..."
                  value={filtros.protocolo}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      protocolo: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Bairro
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Bairro..."
                  value={filtros.bairro}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      bairro: e.target.value
                    })
                  }
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Categoria
                </label>

                <select
                  className="form-select"
                  value={filtros.categoria}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      categoria: e.target.value
                    })
                  }
                >
                  <option value="">Todas</option>
                  <option value="ILUMINACAO">Iluminação</option>
                  <option value="BURACO">Buraco</option>
                  <option value="LIMPEZA">Limpeza</option>
                  <option value="SAUDE">Saúde</option>
                  <option value="SEGURANCA">Segurança</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  value={filtros.status}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      status: e.target.value
                    })
                  }
                >
                  <option value="">Todos</option>
                  <option value="ABERTO">Aberto</option>
                  <option value="TRIAGEM">Triagem</option>
                  <option value="EM_EXECUCAO">Execução</option>
                  <option value="RESOLVIDO">Resolvido</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Local
                </label>

                <select
                  className="form-select"
                  value={filtros.localTipo}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      localTipo: e.target.value
                    })
                  }
                >
                  <option value="">Todos</option>
                  <option value="RUA">Rua</option>
                  <option value="ESCOLA">Escola</option>
                  <option value="HOSPITAL">Hospital</option>
                  <option value="PRACA">Praça</option>
                  <option value="PREFEITURA">Prefeitura</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

            </div>

            {temFiltro && (
              <div className="mt-3">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={limparFiltros}
                >
                  Limpar filtros
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="mb-3">
          <strong>
            {loading
              ? 'Carregando...'
              : `${filtradas.length} solicitação(ões) encontrada(s)`
            }
          </strong>
        </div>

        {loading ? (

          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>

        ) : (

          <div className="row g-3">

            {filtradas.map(sol => {

              const st = statusConfirm[sol.id];

              return (

                <div
                  className="col-md-6 col-lg-4"
                  key={sol.id}
                >
                  <div className="card h-100 shadow-sm">

                    <div className="card-body">

                      <div className="d-flex justify-content-between mb-2">

                        <span className="badge bg-secondary">
                          {sol.protocolo}
                        </span>

                        <StatusBadge status={sol.status} />

                      </div>

                      <p className="small text-muted">
                        {catLabels[sol.categoria]}
                      </p>

                      <p>{sol.descricao}</p>

                      <p className="small text-muted">
                        📍 {sol.endereco?.bairro}
                      </p>

                      <p className="text-primary fw-bold">
                        👥 {sol.confirmacoes ?? 0} confirmação(ões)
                      </p>

                    </div>

                    <div className="card-footer d-flex gap-2">

                      {st === 'confirmado' ? (

                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          disabled
                        >
                          ✅ Confirmado
                        </button>

                      ) : st === 'jaConfirmou' ? (

                        <button
                          className="btn btn-warning btn-sm flex-grow-1"
                          disabled
                        >
                          Já confirmado
                        </button>

                      ) : (

                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          onClick={() => handleConfirmar(sol)}
                        >
                          👍 Confirmar
                        </button>

                      )}

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(`/protocolo/${sol.protocolo}`)
                        }
                      >
                        Detalhes
                      </button>

                    </div>

                  </div>
                </div>

              );
            })}

          </div>

        )}

      </div>

    </Layout>
  );
}

export default ConfirmarSolicitacoes;