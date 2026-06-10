import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

function Registro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const senha = watch('senha');

  const onSubmit = async (dados) => {
    setLoading(true);
    setErro('');

    try {
      // Registra o usuário
      await api.post('/auth/register', {
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
        senha: dados.senha,
        tipo: 'ROLE_CIDADAO',
      });

      // Faz login automático após registro
      const resultado = await login(dados.email, dados.senha);
      if (resultado.success) {
        navigate('/cidadao');
      }

    } catch (error) {
      if (error.response?.status === 400) {
        setErro('Este email já está cadastrado.');
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                
                <h2 className="text-center mb-4">Criar Conta</h2>
                
                {erro && <div className="alert alert-danger">{erro}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                  
                  <div className="mb-3">
                    <label className="form-label">Nome completo *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                      {...register('nome', { required: 'Nome é obrigatório' })}
                    />
                    {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">CPF *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                      placeholder="000.000.000-00"
                      {...register('cpf', { required: 'CPF é obrigatório' })}
                    />
                    {errors.cpf && <div className="invalid-feedback">{errors.cpf.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', { required: 'Email é obrigatório' })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Senha *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                      {...register('senha', { 
                        required: 'Senha é obrigatória',
                        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                      })}
                    />
                    {errors.senha && <div className="invalid-feedback">{errors.senha.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirmar Senha *</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmarSenha ? 'is-invalid' : ''}`}
                      {...register('confirmarSenha', {
                        required: 'Confirmação é obrigatória',
                        validate: value => value === senha || 'As senhas não coincidem'
                      })}
                    />
                    {errors.confirmarSenha && (
                      <div className="invalid-feedback">{errors.confirmarSenha.message}</div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"/>Criando conta...</>
                    ) : 'Criar Conta'}
                  </button>
                </form>

                <p className="text-center mt-3 mb-0">
                  Já tem conta? <Link to="/login">Fazer login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;