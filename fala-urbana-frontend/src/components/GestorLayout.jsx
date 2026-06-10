import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Footer from './Footer';

function GestorLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Navbar do gestor */}
      <nav className="navbar navbar-light bg-white shadow-sm" style={{ zIndex: 10 }}>
        <div className="container-fluid px-3">
          <Link to="/" className="navbar-brand fw-bold fs-4 text-decoration-none">
            <span style={{ color: '#2563eb' }}>fala</span>Urbana
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="fw-bold text-muted small d-none d-md-inline">PAINEL GESTOR</span>
            <div className="dropdown">
              <button
                className="btn border-0 rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, fontSize: '1rem' }}
                data-bs-toggle="dropdown"
                aria-expanded="false">
                👤
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li>
                  <span className="dropdown-item-text small text-muted">
                    {user?.email}
                  </span>
                </li>
                <li><hr className="dropdown-divider my-1" /></li>
                <li>
                  <button
                    className="dropdown-item text-danger fw-semibold"
                    onClick={() => logout('/')}>
                    🚪 Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Corpo: sidebar + conteúdo */}
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 overflow-auto bg-white">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default GestorLayout;