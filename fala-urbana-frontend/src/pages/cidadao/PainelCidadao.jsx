import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StatusBadge from '../../components/StatusBadge';
import solicitacaoService from '../../services/solicitacaoService';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const POR_PAGINA = 5;

function PainelCidadao() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [aba, setAba]               = useState('solicitacoes');
  const [solicitacoes, setSolicita] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [erroLoad, setErroLoad]     = useState(null);
  const [paginaAtual, setPagina]    = useState(1);
  const [salvando, setSalvando]     = useState(false);
  const [msg, setMsg]               = useState(null);

  const { register: rP, handleSubmit: hsP, formState: { errors: eP } } = useForm({
    defaultValues: { nome: user?.nome || '', cpf: user?.cpf || '' },
  });
  const { register: rS, handleSubmit: hsS, watch, formState: { errors: eS }, reset: rReset } = useForm();
  const novaSenha = watch('novaSenha');

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    setErroLoad(null);
    try {
      const dados = await solicitacaoService.minhasSolicitacoes();
      setSolicita(dados);
    } catch (err) {
      console.error(err);
      setErroLoad('Não foi possível carregar suas solicitações. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const total     = solicitacoes.length;
  const abertas   = solicitacoes.filter(s => ['ABERTO','TRIAGEM','EM_EXECUCAO'].includes(s.status)).length;
  const resolvidas = solicitacoes.filter(s => ['RESOLVIDO','ENCERRADO'].includes(s.status)).length;

  const totalPag = Math.ceil(total / POR_PAGINA);
  const paginadas = solicitacoes.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const onSalvarPerfil = async (dados) => {
    setSalvando(true); setMsg(null);
    try {
      await api.put('/usuarios/perfil', dados);
      updateUser({ nome: dados.nome, cpf: dados.cpf });
      setMsg({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' });
    } catch {
      setMsg({ tipo: 'erro', texto: 'Erro ao salvar. Tente novamente.' });
    } finally { setSalvando(false); }
  };

  const onAlterarSenha = async (dados) => {
    setSalvando(true); setMsg(null);
    try {
      await api.put('/usuarios/senha', { senhaAtual: dados.senhaAtual, novaSenha: dados.novaSenha });
      setMsg({ tipo: 'sucesso', texto: 'Senha alterada! Faça login novamente.' });
      rReset();
      setTimeout(() => logout('/login'), 2000);
    } catch (err) {
      const texto = err.response?.data?.mensagem || 'Senha atual incorreta.';
      setMsg({ tipo: 'erro', texto });
    } finally { setSalvando(false); }
  };

  const catLabels = { ILUMINACAO:'💡', BURACO:'🕳️', LIMPEZA:'🧹', SAUDE:'🏥', SEGURANCA:'🔒', OUTRO:'📌' };

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Navbar do cidadão */}
      <nav className="navbar navbar-light bg-white border-bottom">
        <div className="container-fluid px-3 d-flex justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold fs-5" to="/">
            <span style={{ color: '#2563eb' }}>fala</span>Urbana
          </Link>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-link text-muted small text-decoration-none p-0"
                    onClick={() => { setAba('perfil'); setMsg(null); }}>
              Meu Perfil
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => logout('/')}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">

        {/* Cabeçalho com avatar */}
        <div className="border-bottom bg-light">
          <div className="container py-3 d-flex align-items-center gap-3">
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '2px solid #cbd5e1', backgroundColor: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem'
            }}>👤</div>
            <div>
              <h5 className="mb-0 fw-bold">{user?.nome || user?.email}</h5>
              <p className="mb-0 text-muted small">
                {user?.email}
                <span className="ms-2 badge bg-primary" style={{ fontSize: '0.68rem' }}>
                  Cidadão
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="container py-4">

          {/* Abas */}
          <div className="d-flex gap-2 mb-4 border-bottom pb-2 flex-wrap">
            {[
              { key: 'solicitacoes', label: '📋 Minhas Solicitações' },
              { key: 'perfil',       label: '✏️ Editar Perfil' },
              { key: 'senha',        label: '🔐 Alterar Senha' },
            ].map(tab => (
              <button key={tab.key}
                className={`btn btn-sm ${aba === tab.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => { setAba(tab.key); setMsg(null); }}>
                {tab.label}
              </button>
            ))}
            <Link to="/nova-solicitacao" className="btn btn-success btn-sm ms-auto">
              + Nova Solicitação
            </Link>
          </div>

          {/* ===== ABA SOLICITAÇÕES ===== */}
          {aba === 'solicitacoes' && (
            <>
              {/* Resumo */}
              <div className="row g-3 mb-4">
                {[
                  { label: 'Total', valor: total, cor: 'text-primary' },
                  { label: 'Em andamento', valor: abertas, cor: 'text-warning' },
                  { label: 'Resolvidas', valor: resolvidas, cor: 'text-success' },
                ].map(c => (
                  <div key={c.label} className="col-4">
                    <div className="card text-center border-0 shadow-sm">
                      <div className="card-body py-3">
                        <div className={`fs-3 fw-bold ${c.cor}`}>{c.valor}</div>
                        <div className="small text-muted">{c.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="fw-bold mb-3">minhas solicitações :</p>

              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                  <p className="mt-2 small text-muted">Carregando...</p>
                </div>
              )}

              {/* NOVO: exibe mensagem de erro detalhada */}
              {!loading && erroLoad && (
                <div className="alert alert-warning d-flex align-items-center gap-2">
                  ⚠️ {erroLoad}
                  <button className="btn btn-sm btn-outline-warning ms-auto" onClick={carregar}>
                    Tentar novamente
                  </button>
                </div>
              )}

              {!loading && !erroLoad && total === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">Você ainda não tem solicitações.</p>
                  <Link to="/nova-solicitacao" className="btn btn-primary">
                    Criar primeira solicitação
                  </Link>
                </div>
              )}

              {!loading && !erroLoad && paginadas.map(sol => (
                <div key={sol.id}
                     className="d-flex align-items-center gap-3 p-3 border rounded mb-2 bg-white"
                     style={{ cursor: 'pointer' }}
                     onClick={() => navigate(`/protocolo/${sol.protocolo}`)}>
                  <div style={{
                    minWidth: 68, height: 58, border: '1.5px solid #cbd5e1',
                    borderRadius: 8, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', color: '#475569', padding: 4,
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>{catLabels[sol.categoria] || '📌'}</span>
                    <span className="font-monospace" style={{ fontSize: '0.6rem', marginTop: 2 }}>
                      {sol.protocolo?.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-0 small fw-semibold" style={{
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {sol.descricao}
                    </p>
                    {sol.endereco && (
                      <p className="mb-0 text-muted" style={{ fontSize: '0.73rem' }}>
                        📍 {sol.endereco.bairro}
                      </p>
                    )}
                  </div>
                  <div className="text-end flex-shrink-0">
                    <StatusBadge status={sol.status} />
                  </div>
                </div>
              ))}

              {totalPag > 1 && (
                <div className="d-flex justify-content-end mt-3">
                  <ul className="pagination pagination-sm mb-0">
                    {Array.from({ length: totalPag }, (_, i) => i + 1).map(n => (
                      <li key={n} className={`page-item ${paginaAtual === n ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPagina(n)}>{n}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* ===== ABA PERFIL ===== */}
          {aba === 'perfil' && (
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Dados Pessoais</h5>

                    <div className="p-3 bg-light rounded mb-3">
                      <p className="small text-muted mb-1">NOME</p>
                      <p className="fw-semibold mb-2">{user?.nome || '—'}</p>
                      <p className="small text-muted mb-1">EMAIL</p>
                      <p className="fw-semibold mb-2">{user?.email}</p>
                      <p className="small text-muted mb-1">TIPO</p>
                      <span className="badge bg-primary">Cidadão</span>
                    </div>

                    <hr />
                    <h6 className="mb-3">Editar</h6>

                    {msg && (
                      <div className={`alert alert-${msg.tipo === 'sucesso' ? 'success' : 'danger'} py-2`}>
                        {msg.texto}
                      </div>
                    )}

                    <form onSubmit={hsP(onSalvarPerfil)}>
                      <div className="mb-3">
                        <label className="form-label">Nome completo</label>
                        <input type="text"
                          className={`form-control ${eP.nome ? 'is-invalid' : ''}`}
                          {...rP('nome', { required: 'Nome obrigatório' })} />
                        {eP.nome && <div className="invalid-feedback">{eP.nome.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">CPF</label>
                        <input type="text" className="form-control" {...rP('cpf')} />
                      </div>
                      <button type="submit" className="btn btn-primary w-100" disabled={salvando}>
                        {salvando ? <><span className="spinner-border spinner-border-sm me-2" />Salvando...</> : 'Salvar Alterações'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== ABA SENHA ===== */}
          {aba === 'senha' && (
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Alterar Senha</h5>

                    {msg && (
                      <div className={`alert alert-${msg.tipo === 'sucesso' ? 'success' : 'danger'} py-2`}>
                        {msg.texto}
                      </div>
                    )}

                    <form onSubmit={hsS(onAlterarSenha)}>
                      <div className="mb-3">
                        <label className="form-label">Senha atual</label>
                        <input type="password"
                          className={`form-control ${eS.senhaAtual ? 'is-invalid' : ''}`}
                          {...rS('senhaAtual', { required: 'Informe a senha atual' })} />
                        {eS.senhaAtual && <div className="invalid-feedback">{eS.senhaAtual.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Nova senha</label>
                        <input type="password"
                          className={`form-control ${eS.novaSenha ? 'is-invalid' : ''}`}
                          {...rS('novaSenha', { required: 'Informe a nova senha', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
                        {eS.novaSenha && <div className="invalid-feedback">{eS.novaSenha.message}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirmar nova senha</label>
                        <input type="password"
                          className={`form-control ${eS.confirmar ? 'is-invalid' : ''}`}
                          {...rS('confirmar', { required: 'Confirme', validate: v => v === novaSenha || 'Senhas não coincidem' })} />
                        {eS.confirmar && <div className="invalid-feedback">{eS.confirmar.message}</div>}
                      </div>
                      <button type="submit" className="btn btn-primary w-100" disabled={salvando}>
                        {salvando ? <><span className="spinner-border spinner-border-sm me-2" />Alterando...</> : 'Alterar Senha'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PainelCidadao;