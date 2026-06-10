import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GestorLayout from '../../components/GestorLayout';
import SolicitacaoCard from '../../components/SolicitacaoCard';
import solicitacaoService from '../../services/solicitacaoService';

const CORES = ['#0d6efd', '#ffc107', '#0dcaf0', '#198754', '#6c757d'];

function DashboardGestor() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const dados = await solicitacaoService.listarTodas();
      setSolicitacoes(dados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar solicitações. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const dadosGrafico = ['ABERTO', 'TRIAGEM', 'EM_EXECUCAO', 'RESOLVIDO', 'ENCERRADO']
    .map(status => ({
      name: status.replace('_', ' '),
      value: solicitacoes.filter(s => s.status === status).length,
    }))
    .filter(d => d.value > 0);

  const ultimas = [...solicitacoes].reverse().slice(0, 4);

  const stats = [
    { label: 'Total', value: solicitacoes.length, cor: '#0d6efd' },
    { label: 'Abertos', value: solicitacoes.filter(s => s.status === 'ABERTO').length, cor: '#ffc107' },
    { label: 'Em Execução', value: solicitacoes.filter(s => s.status === 'EM_EXECUCAO').length, cor: '#0dcaf0' },
    { label: 'Resolvidos', value: solicitacoes.filter(s => s.status === 'RESOLVIDO').length, cor: '#198754' },
  ];

  return (
    <GestorLayout>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-2 text-muted">Carregando dados...</p>
        </div>
      ) : erro ? (
        <div className="alert alert-danger">{erro}</div>
      ) : (
        <>
          {/* Cards de indicadores rápidos */}
          <div className="row g-3 mb-4">
            {stats.map(stat => (
              <div key={stat.label} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center">
                  <div className="card-body py-3">
                    <div className="fs-2 fw-bold" style={{ color: stat.cor }}>
                      {stat.value}
                    </div>
                    <div className="small text-muted">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estatísticas com gráfico */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="text-muted mb-3">→ Estatísticas por Status</h5>
              {dadosGrafico.length === 0 ? (
                <p className="text-muted text-center py-4">
                  Nenhuma solicitação para exibir no gráfico.
                </p>
              ) : (
                <div className="row align-items-center">
                  <div className="col-md-7">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dadosGrafico}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }>
                          {dadosGrafico.map((entry, index) => (
                            <Cell key={entry.name} fill={CORES[index % CORES.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="col-md-5">
                    {dadosGrafico.map((item, index) => (
                      <div key={item.name} className="d-flex align-items-center gap-2 mb-3">
                        <div style={{
                          width: 16, height: 16,
                          backgroundColor: CORES[index],
                          borderRadius: 3
                        }} />
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <div className="text-muted small">{item.value} solicitações</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Últimas Solicitações */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-muted mb-0">→ Últimas Solicitações</h5>
                <Link to="/gestor/solicitacoes" className="btn btn-outline-primary btn-sm">
                  Ver todas
                </Link>
              </div>

              {ultimas.length === 0 ? (
                <p className="text-center text-muted py-3">Nenhuma solicitação ainda.</p>
              ) : (
                <div className="row g-3">
                  {ultimas.map(sol => (
                    <div key={sol.id} className="col-md-6">
                      <SolicitacaoCard
                        solicitacao={sol}
                        linkTo={`/gestor/solicitacao/${sol.id}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </GestorLayout>
  );
}

export default DashboardGestor;