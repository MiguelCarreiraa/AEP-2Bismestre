import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';

function Home() {
  const [protocolo, setProtocolo] = useState('');
  const [erroBusca, setErroBusca] = useState('');
  const navigate = useNavigate();

  const handleBuscarProtocolo = (e) => {
    e.preventDefault();
    const valor = protocolo.trim();
    if (!valor) {
      setErroBusca('Digite um número de protocolo.');
      return;
    }
    setErroBusca('');
    navigate(`/protocolo/${valor}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">Sua voz na cidade</h1>
          <p className="lead mb-4">
            Registre problemas urbanos, acompanhe soluções e
            participe da melhoria da sua cidade.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/nova-solicitacao" className="btn btn-light btn-lg">
              Criar Solicitação
            </Link>
            <Link to="/confirmar-solicitacoes" className="btn btn-outline-light btn-lg">
              Confirmar Ocorrências
            </Link>
          </div>
        </div>
      </section>

      {/* Busca por Protocolo */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Consultar Protocolo</h2>
          <p className="text-center text-muted mb-4">
            Digite o número do protocolo que você recebeu ao criar sua solicitação.
          </p>
          <form onSubmit={handleBuscarProtocolo}
                className="d-flex flex-column align-items-center gap-2">
            <div className="d-flex gap-2 w-100 justify-content-center">
              <input
                type="text"
                className={`form-control ${erroBusca ? 'is-invalid' : ''}`}
                style={{ maxWidth: '420px' }}
                placeholder="Ex: ABCD1234"
                value={protocolo}
                onChange={e => { setProtocolo(e.target.value); setErroBusca(''); }}
              />
              <button type="submit" className="btn btn-primary px-4">
                Buscar
              </button>
            </div>
            {erroBusca && (
              <div className="text-danger small">{erroBusca}</div>
            )}
          </form>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">O que você pode registrar?</h2>
          <div className="row g-3">
            {[
              { icon: '💡', label: 'Iluminação', desc: 'Postes apagados ou danificados' },
              { icon: '🕳️', label: 'Buracos', desc: 'Vias com buracos ou irregularidades' },
              { icon: '🧹', label: 'Limpeza', desc: 'Lixo acumulado ou entulho' },
              { icon: '🔒', label: 'Segurança', desc: 'Ocorrências de segurança pública' },
              { icon: '🏥', label: 'Saúde', desc: 'Problemas em equipamentos de saúde' },
              { icon: '📌', label: 'Outros', desc: 'Qualquer outro problema urbano' },
            ].map(cat => (
              <div key={cat.label} className="col-6 col-md-4 col-lg-2">
                <div className="card text-center h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="fs-1 mb-2">{cat.icon}</div>
                    <h6 className="card-title">{cat.label}</h6>
                    <p className="card-text text-muted small">{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-5" style={{ backgroundColor: '#f0f7ff' }}>
        <div className="container text-center">
          <h3 className="mb-3">Não precisa criar conta para começar</h3>
          <p className="text-muted mb-4">
            Registre uma solicitação agora como anônimo e acompanhe com o protocolo.
            Crie uma conta para ter acesso completo ao histórico.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/nova-solicitacao" className="btn btn-primary">
              Registrar Agora (Anônimo)
            </Link>
            <Link to="/registro" className="btn btn-outline-primary">
              Criar Conta de Cidadão
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Home;