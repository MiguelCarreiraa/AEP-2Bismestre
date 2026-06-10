import { useState } from 'react';
import Layout from '../../components/Layout';

const PERGUNTAS = [
  { id: 1, pergunta: 'Como faço para criar uma nova solicitação?', resposta: 'Acesse "Criar Solicitação" no menu e preencha o formulário com categoria, descrição e endereço. Você receberá um protocolo ao final.' },
  { id: 2, pergunta: 'Qual o prazo para a resolução de uma solicitação?', resposta: 'O prazo varia conforme a natureza do problema. Você pode acompanhar o status pelo protocolo na página inicial.' },
  { id: 3, pergunta: 'Posso editar uma solicitação após enviá-la?', resposta: 'Solicitações com status "Aberto" podem ser visualizadas. Entre em contato com o suporte para alterações.' },
  { id: 4, pergunta: 'Preciso criar uma conta para fazer uma solicitação?', resposta: 'Não! Solicitações anônimas são aceitas. Crie uma conta para acompanhar todas as suas solicitações em um só lugar.' },
  { id: 5, pergunta: 'Como consultar o status da minha solicitação?', resposta: 'Na página inicial, use a busca por protocolo. Digite o número que você recebeu ao criar a solicitação.' },
  { id: 6, pergunta: 'O que significa cada status?', resposta: 'ABERTO: aguardando triagem. TRIAGEM: em análise. EM_EXECUCAO: sendo resolvida. RESOLVIDO: problema solucionado. ENCERRADO: processo finalizado.' },
  { id: 7, pergunta: 'Como confirmo uma solicitação de outro cidadão?', resposta: 'Acesse "Confirmar Solicitações" no menu, encontre o problema na sua região e clique em "Confirmar". Isso aumenta a prioridade da solicitação.' },
  { id: 8, pergunta: 'O que é o código de protocolo?', resposta: 'É um código único gerado automaticamente ao criar uma solicitação. Use-o para acompanhar o andamento sem precisar de uma conta.' },
];

const POR_PAGINA = 4;

function FAQ() {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);

  const filtradas = PERGUNTAS.filter(p =>
    p.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
    p.resposta.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA);
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const paginadas = filtradas.slice(inicio, inicio + POR_PAGINA);

  const handleBusca = (e) => {
    setBusca(e.target.value);
    setPaginaAtual(1);
  };

  return (
    <Layout>
      <div className="container py-4">
        <p className="text-muted small">→ FAQ</p>

        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Perguntas Frequentes</h2>

            <div className="input-group mb-4" style={{ maxWidth: '400px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar perguntas..."
                value={busca}
                onChange={handleBusca}
              />
              <span className="input-group-text">🔍</span>
            </div>

            <div className="row">
              {paginadas.map(item => (
                <div key={item.id} className="col-md-6 mb-4">
                  <h6 className="fw-bold">{item.pergunta}</h6>
                  <p className="text-muted small">{item.resposta}</p>
                  <hr />
                </div>
              ))}
            </div>

            {filtradas.length === 0 && (
              <p className="text-center text-muted">
                Nenhuma pergunta encontrada para "{busca}"
              </p>
            )}

            {totalPaginas > 1 && (
              <nav className="d-flex justify-content-center">
                <ul className="pagination pagination-sm">
                  <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPaginaAtual(1)}>«</button>
                  </li>
                  <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPaginaAtual(p => p - 1)}>‹</button>
                  </li>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                    <li key={num} className={`page-item ${paginaAtual === num ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setPaginaAtual(num)}>{num}</button>
                    </li>
                  ))}
                  <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPaginaAtual(p => p + 1)}>›</button>
                  </li>
                  <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setPaginaAtual(totalPaginas)}>»</button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default FAQ;