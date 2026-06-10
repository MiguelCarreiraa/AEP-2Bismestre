import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

function Login() {
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
      // Redireciona baseado no tipo de usuário
      if (resultado.data.tipo === 'ROLE_GESTOR') {
        navigate('/gestor');
      } else {
        navigate('/cidadao');
      }
    } else {
      setErro(resultado.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                
                <h2 className="text-center mb-4">Entrar</h2>
                
                {erro && <div className="alert alert-danger">{erro}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', { required: 'Email é obrigatório' })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                      {...register('senha', { required: 'Senha é obrigatória' })}
                    />
                    {errors.senha && (
                      <div className="invalid-feedback">{errors.senha.message}</div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
                    ) : 'Entrar'}
                  </button>
                </form>

                <p className="text-center mt-3 mb-0">
                  Não tem conta? <Link to="/registro">Registre-se</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;