import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SolicitacaoCard from '../../components/SolicitacaoCard';
import solicitacaoService from '../../services/solicitacaoService';
import { useAuth } from '../../context/AuthContext';

function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      const dados = await solicitacaoService.minhasSolicitacoes();
      setSolicitacoes(dados);
    } catch (error) {
      setErro('Erro ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas rápidas
  const total = solicitacoes.length;
  const abertas = solicitacoes.filter(s => s.status === 'ABERTO' || s.status === 'TRIAGEM' || s.status === 'EM_EXECUCAO').length;
  const resolvidas = solicitacoes.filter(s => s.status === 'RESOLVIDO' || s.status === 'ENCERRADO').length;

  return (
    <div>
      <Navbar />
      <div className="container py-4">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Minhas Solicitações</h2>
          <Link to="/nova-solicitacao" className="btn btn-primary">
            + Nova Solicitação
          </Link>
        </div>

        {/* Cards de resumo */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h3 className="display-6">{total}</h3>
                <p className="mb-0">Total</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark">
              <div className="card-body text-center">
                <h3 className="display-6">{abertas}</h3>
                <p className="mb-0">Em andamento</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h3 className="display-6">{resolvidas}</h3>
                <p className="mb-0">Resolvidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de solicitações */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        )}

        {erro && <div className="alert alert-danger">{erro}</div>}

        {!loading && !erro && solicitacoes.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted fs-5">Você ainda não tem solicitações.</p>
            <Link to="/nova-solicitacao" className="btn btn-primary">
              Criar primeira solicitação
            </Link>
          </div>
        )}

        <div className="row g-3">
          {solicitacoes.map((sol) => (
            <div key={sol.id} className="col-md-6 col-lg-4">
              <SolicitacaoCard 
                solicitacao={sol} 
                linkTo={`/cidadao/solicitacao/${sol.id}`}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MinhasSolicitacoes;