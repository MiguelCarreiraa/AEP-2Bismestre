import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// ============================================================
// NOVA PÁGINA: Login do Gestor
// Separado do login do cidadão conforme solicitado.
// Rota: /gestor/login
// Após login, verifica se o tipo é ROLE_GESTOR.
// ============================================================
function LoginGestor() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (dados) => {
    setLoading(true);
    setErro('');

    const resultado = await login(dados.email, dados.senha);

    if (resultado.success) {
      if (resultado.data.tipo === 'ROLE_GESTOR') {
        navigate('/gestor');
      } else {
        // Logou mas não é gestor
        setErro('Esta conta não tem permissão de gestor. Use o login de cidadão.');
      }
    } else {
      setErro(resultado.message || 'Email ou senha incorretos.');
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0a2463' }}>

      {/* Header simples */}
      <div className="text-center py-4">
        <Link to="/" className="text-white text-decoration-none fs-4 fw-bold">
          <span style={{ color: '#60a5fa' }}>fala</span>Urbana
        </Link>
      </div>

      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3">
        <div className="card shadow-lg" style={{ maxWidth: 420, width: '100%' }}>
          <div className="card-body p-4">

            {/* Badge de gestor */}
            <div className="text-center mb-3">
              <span className="badge bg-primary px-3 py-2 fs-6">🔐 Área do Gestor</span>
            </div>

            <h4 className="text-center mb-4 fw-bold">Acesso ao Painel</h4>

            {erro && <div className="alert alert-danger py-2 small">{erro}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email institucional</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="gestor@prefeitura.gov.br"
                  {...register('email', { required: 'Email obrigatório' })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Senha</label>
                <input
                  type="password"
                  className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                  {...register('senha', { required: 'Senha obrigatória' })}
                />
                {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
                  : 'Acessar Painel'}
              </button>
            </form>

            <hr className="my-3" />

            <div className="d-flex justify-content-between small">
              <Link to="/gestor/registro" className="text-primary text-decoration-none">
                Registrar-se como Gestor
              </Link>
              <Link to="/login" className="text-muted text-decoration-none">
                Sou cidadão
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-3">
        <Link to="/" className="text-white-50 small text-decoration-none">← Voltar ao início</Link>
      </div>
    </div>
  );
}

export default LoginGestor;