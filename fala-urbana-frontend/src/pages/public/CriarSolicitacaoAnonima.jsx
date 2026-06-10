import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import solicitacaoService from '../../services/solicitacaoService';

function CriarSolicitacaoAnonima() {
  const [protocolo, setProtocolo] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [erro, setErro]           = useState(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const localTipo = watch('localTipo');

  const onSubmit = async (dados) => {
    setLoading(true);
    setErro(null);
    try {
      const solicitacao = {
        descricao:  dados.descricao,
        categoria:  dados.categoria,
        localTipo:  dados.localTipo,
        localOutro: dados.localOutro || null,
        prioridade: 'MEDIA',
        endereco: {
          rua:        dados.rua,
          numero:     dados.numero,
          cep:        dados.cep,
          bairro:     dados.bairro,
          referencia: dados.referencia || null,
        },
      };
      const resposta = await solicitacaoService.criar(solicitacao);
      setProtocolo(resposta.protocolo);
    } catch (err) {
      console.error(err);
      setErro('Erro ao criar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Tela de sucesso com o protocolo
  if (protocolo) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="card mx-auto shadow-sm" style={{ maxWidth: '520px' }}>
            <div className="card-body py-5 px-4">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 className="fw-bold text-success mb-2">Solicitação enviada!</h3>
              <p className="text-muted mb-3">
                Sua solicitação foi registrada com sucesso. Guarde o protocolo abaixo:
              </p>
              <div className="p-3 mb-3 rounded font-monospace fw-bold fs-4"
                   style={{ background: 'var(--bs-primary-bg-subtle)', color: 'var(--bs-primary)', border: '1.5px dashed var(--bs-primary)' }}>
                {protocolo}
              </div>
              <p className="small text-muted mb-4">
                Use este número na <Link to="/">página inicial</Link> para acompanhar o andamento da sua solicitação.
              </p>
              <button className="btn btn-outline-primary btn-sm"
                      onClick={() => { setProtocolo(null); reset(); }}>
                Criar outra solicitação
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">

            {/* BANNER DE ANONIMATO */}
            <div className="rounded-3 p-4 mb-4"
                 style={{ background: '#f8f9fa', border: '0.5px solid #dee2e6' }}>

              {/* Cabeçalho do banner */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle"
                     style={{ width: 48, height: 48, background: '#fff', border: '1px solid #dee2e6', flexShrink: 0 }}>
                  <span style={{ fontSize: '1.4rem' }}>🕵️</span>
                </div>
                <div>
                  <p className="text-uppercase text-muted mb-0"
                     style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                    Solicitação anônima
                  </p>
                  <h5 className="fw-bold mb-0">Você não precisa criar uma conta</h5>
                </div>
              </div>

              {/* Aviso de privacidade */}
              <div className="rounded-2 p-3 mb-3 d-flex gap-2 align-items-start"
                   style={{ background: '#fff8ec', border: '1px solid #fde8a0' }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>🔒</span>
                <div>
                  <p className="fw-bold mb-1" style={{ fontSize: '0.875rem', color: '#856404' }}>
                    Sua privacidade está protegida
                  </p>
                  <p className="mb-0" style={{ fontSize: '0.825rem', color: '#856404', lineHeight: 1.6 }}>
                    Não coletamos nenhum dado pessoal nesta modalidade.
                    Nenhum nome, CPF, e-mail ou informação de identificação é registrado ou armazenado no sistema.
                  </p>
                </div>
              </div>

              {/* Checklist de garantias */}
              <div className="row g-2 mb-3">
                {[
                  { icon: '✅', texto: 'Sem cadastro necessário' },
                  { icon: '✅', texto: 'Dados pessoais não armazenados' },
                  { icon: '✅', texto: 'Protocolo gerado ao enviar' },
                  { icon: '✅', texto: 'Acompanhe pelo protocolo' },
                ].map(item => (
                  <div key={item.texto} className="col-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-white"
                         style={{ border: '0.5px solid #dee2e6', fontSize: '0.8rem', color: '#495057' }}>
                      <span>{item.icon}</span>
                      <span>{item.texto}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sugestão de conta */}
              <div className="d-flex gap-2 align-items-start p-2 rounded-2 bg-white"
                   style={{ border: '0.5px solid #dee2e6' }}>
                <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>ℹ️</span>
                <p className="mb-0" style={{ fontSize: '0.8rem', color: '#6c757d', lineHeight: 1.6 }}>
                  Quer acompanhar todas as suas solicitações em um só lugar?{' '}
                  <Link to="/registro" style={{ color: '#0d6efd' }}>
                    Crie uma conta gratuita
                  </Link>{' '}
                  e tenha acesso ao histórico completo.
                </p>
              </div>
            </div>

            {/* Título do formulário */}
            <h4 className="fw-bold mb-1">Nova Solicitação</h4>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
              Preencha os dados abaixo. Ao enviar, você receberá um código de protocolo para acompanhamento.
            </p>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>

              <div className="mb-3">
                <label className="form-label fw-bold">Categoria *</label>
                <select className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
                  {...register('categoria', { required: 'Selecione uma categoria' })}>
                  <option value="">Selecione...</option>
                  <option value="ILUMINACAO">💡 Iluminação</option>
                  <option value="BURACO">🕳️ Buraco</option>
                  <option value="LIMPEZA">🧹 Limpeza</option>
                  <option value="SAUDE">🏥 Saúde</option>
                  <option value="SEGURANCA">🔒 Segurança</option>
                  <option value="OUTRO">📌 Outro</option>
                </select>
                {errors.categoria && <div className="invalid-feedback">{errors.categoria.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Descrição *</label>
                <textarea className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
                  rows={4}
                  placeholder="Descreva o problema com o máximo de detalhes..."
                  {...register('descricao', {
                    required: 'Descrição é obrigatória',
                    minLength: { value: 10, message: 'Mínimo de 10 caracteres' },
                  })} />
                {errors.descricao && <div className="invalid-feedback">{errors.descricao.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Tipo de Local *</label>
                <select className={`form-select ${errors.localTipo ? 'is-invalid' : ''}`}
                  {...register('localTipo', { required: 'Selecione o tipo de local' })}>
                  <option value="">Selecione...</option>
                  <option value="HOSPITAL">🏥 Hospital</option>
                  <option value="ESCOLA">🏫 Escola</option>
                  <option value="PRACA">🌳 Praça</option>
                  <option value="PREFEITURA">🏛️ Prefeitura</option>
                  <option value="RUA">🛣️ Rua</option>
                  <option value="OUTRO">📌 Outro</option>
                </select>
                {errors.localTipo && <div className="invalid-feedback">{errors.localTipo.message}</div>}
              </div>

              {localTipo === 'OUTRO' && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Especifique o local *</label>
                  <input type="text"
                    className={`form-control ${errors.localOutro ? 'is-invalid' : ''}`}
                    {...register('localOutro', { required: 'Especifique o local' })} />
                  {errors.localOutro && <div className="invalid-feedback">{errors.localOutro.message}</div>}
                </div>
              )}

              <hr className="my-4" />
              <h5 className="fw-bold mb-3">📍 Endereço</h5>

              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Rua *</label>
                  <input type="text"
                    className={`form-control ${errors.rua ? 'is-invalid' : ''}`}
                    {...register('rua', { required: 'Rua é obrigatória' })} />
                  {errors.rua && <div className="invalid-feedback">{errors.rua.message}</div>}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Número *</label>
                  <input type="text"
                    className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                    {...register('numero', { required: 'Obrigatório' })} />
                  {errors.numero && <div className="invalid-feedback">{errors.numero.message}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label className="form-label">CEP *</label>
                  <input type="text"
                    className={`form-control ${errors.cep ? 'is-invalid' : ''}`}
                    placeholder="00000-000"
                    {...register('cep', { required: 'CEP é obrigatório' })} />
                  {errors.cep && <div className="invalid-feedback">{errors.cep.message}</div>}
                </div>
                <div className="col-md-7 mb-3">
                  <label className="form-label">Bairro *</label>
                  <input type="text"
                    className={`form-control ${errors.bairro ? 'is-invalid' : ''}`}
                    {...register('bairro', { required: 'Bairro é obrigatório' })} />
                  {errors.bairro && <div className="invalid-feedback">{errors.bairro.message}</div>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Ponto de Referência</label>
                <input type="text" className="form-control"
                  placeholder="Ex: Próximo ao mercado X..."
                  {...register('referencia')} />
              </div>

              {/* Botão com lembrete de anonimato */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                  🕵️ Enviando como anônimo — nenhum dado pessoal será registrado
                </span>
              </div>
              <button type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
                  : '📤 Enviar Solicitação Anônima'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CriarSolicitacaoAnonima;