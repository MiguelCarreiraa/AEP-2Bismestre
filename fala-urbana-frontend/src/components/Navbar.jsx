import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated, isGestor } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">

        <Link className="navbar-brand fw-bold fs-4" to="/">
          <span style={{ color: '#2563eb' }}>fala</span>Urbana
        </Link>

        <button className="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/nova-solicitacao">Criar Solicitação</Link>
              
            </li>
            <li className="nav-item">
             <Link className="nav-link" to="/confirmar-solicitacoes">
                 Confirmar Solicitações
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">FAQ</Link>
            </li>
          </ul>

          <div className="d-flex gap-2 align-items-center flex-wrap">
            {isAuthenticated() ? (
              <>
                <span className="navbar-text small me-1">
                  Olá, <strong>{user?.nome?.split(' ')[0] || user?.email?.split('@')[0]}</strong>
                </span>
                {isGestor() ? (
                  <Link to="/gestor" className="btn btn-outline-primary btn-sm">
                    Painel Gestor
                  </Link>
                ) : (
                  <Link to="/cidadao" className="btn btn-outline-primary btn-sm">
                    Meu Painel
                  </Link>
                )}
                {/* Logout com feedback via AuthContext */}
                <button
                  onClick={() => logout('/')}
                  className="btn btn-danger btn-sm">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/registro" className="btn btn-outline-primary btn-sm">
                  Registrar-se
                </Link>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;