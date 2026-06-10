import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import solicitacaoService from '../../services/solicitacaoService';
import { useAuth } from '../../context/AuthContext';

// Página de criar solicitação para cidadão LOGADO.
// Diferente da versão anônima:
//   - Não mostra o banner de anonimato
//   - Mostra o nome do usuário logado
//   - Após criar, redireciona para o painel do cidadão
//     onde a solicitação já aparece em "Minhas Solicitações"

function CriarSolicitacaoCidadao() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Tela de sucesso
  if (protocolo) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="card mx-auto shadow-sm" style={{ maxWidth: '520px' }}>
            <div className="card-body py-5 px-4">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 className="fw-bold text-success mb-2">Solicitação enviada!</h3>
              <p className="text-muted mb-3">
                Sua solicitação foi registrada com sucesso e já aparece no seu painel.
              </p>
              <div className="p-3 mb-3 rounded font-monospace fw-bold fs-4"
                   style={{
                     background: '#e7f1ff',
                     color: '#0d6efd',
                     border: '1.5px dashed #0d6efd',
                   }}>
                {protocolo}
              </div>
              <p className="small text-muted mb-4">
                Você também pode acompanhar pelo protocolo na{' '}
                <Link to="/">página inicial</Link>.
              </p>
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/cidadao')}>
                  Ver minhas solicitações
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => { setProtocolo(null); reset(); }}>
                  Criar outra
                </button>
              </div>
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

            {/* Banner do cidadão logado */}
            <div className="rounded-3 p-4 mb-4"
                 style={{ background: '#e7f1ff', border: '1px solid #b6d4fe' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle"
                     style={{
                       width: 48, height: 48, flexShrink: 0,
                       background: '#fff',
                       border: '1px solid #b6d4fe',
                     }}>
                  <span style={{ fontSize: '1.4rem' }}>👤</span>
                </div>
                <div>
                  <p className="mb-0 fw-bold" style={{ color: '#084298' }}>
                    Olá, {user?.nome?.split(' ')[0] || user?.email?.split('@')[0]}!
                  </p>
                  <p className="mb-0 small" style={{ color: '#084298', opacity: 0.8 }}>
                    Esta solicitação ficará vinculada à sua conta e aparecerá em{' '}
                    <Link to="/cidadao" style={{ color: '#084298', fontWeight: 600 }}>
                      Minhas Solicitações
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            <h4 className="fw-bold mb-1">Nova Solicitação</h4>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
              Preencha os dados abaixo. Ao enviar, você poderá acompanhar pelo painel ou pelo protocolo.
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
                <textarea
                  className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
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

              <button type="submit"
                      className="btn btn-primary btn-lg w-100"
                      disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Enviando...</>
                  : '📤 Enviar Solicitação'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CriarSolicitacaoCidadao;