import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Home() {
  const [protocolo, setProtocolo] = useState('');
  const navigate = useNavigate();

  const handleBuscarProtocolo = (e) => {
    e.preventDefault();

    if (protocolo.trim()) {
      navigate(`/protocolo/${protocolo.trim()}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">

        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <div className="container text-center py-4">
            <h1 className="display-4 fw-bold mb-3">
              Sua voz na cidade
            </h1>

            <p className="lead mb-4">
              Registre problemas urbanos, acompanhe soluções e
              participe da melhoria da sua cidade.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link
                to="/nova-solicitacao"
                className="btn btn-light btn-lg"
              >
                Criar Solicitação
              </Link>

              <Link
                to="/registro"
                className="btn btn-outline-light btn-lg"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </section>

        {/* Consulta por protocolo */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-4">
              Consultar Protocolo
            </h2>

            <form
              onSubmit={handleBuscarProtocolo}
              className="d-flex gap-2 justify-content-center flex-wrap"
            >
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: '400px' }}
                placeholder="Digite o número do protocolo..."
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary"
              >
                Buscar
              </button>
            </form>
          </div>
        </section>

        {/* Categorias */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-4">
              O que você pode registrar?
            </h2>

            <div className="row g-3">

              {[
                {
                  icon: '💡',
                  label: 'Iluminação',
                  desc: 'Postes apagados ou danificados'
                },
                {
                  icon: '🕳️',
                  label: 'Buracos',
                  desc: 'Vias com buracos ou irregularidades'
                },
                {
                  icon: '🧹',
                  label: 'Limpeza',
                  desc: 'Lixo acumulado ou entulho'
                },
                {
                  icon: '🔒',
                  label: 'Segurança',
                  desc: 'Ocorrências de segurança pública'
                },
                {
                  icon: '🏥',
                  label: 'Saúde',
                  desc: 'Problemas em equipamentos de saúde'
                },
                {
                  icon: '📌',
                  label: 'Outros',
                  desc: 'Qualquer outro problema urbano'
                }
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="col-6 col-md-4 col-lg-2"
                >
                  <div className="card text-center h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="fs-1 mb-2">
                        {cat.icon}
                      </div>

                      <h6 className="card-title">
                        {cat.label}
                      </h6>

                      <p className="card-text text-muted small">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;