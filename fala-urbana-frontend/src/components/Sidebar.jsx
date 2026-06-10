import { Link, useLocation } from 'react-router-dom';

// ============================================================
// SIMPLIFICADO: removidos todos os submenus do LISTAR.
// Agora só existe:
//   🏠 HOME → /gestor
//   📋 Listar Solicitações → /gestor/solicitacoes (com filtros inline)
//   ✏️ ATUALIZAR → /gestor/atualizar
// Os filtros ficam na própria página de listagem.
// ============================================================
function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? { color: '#2563eb', fontWeight: 700 }
      : { color: '#475569' };

  return (
    <div
      className="d-flex flex-column p-3 bg-light border-end"
      style={{ width: '190px', minHeight: '100%', flexShrink: 0 }}>

      {/* HOME */}
      <Link
        to="/gestor"
        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded mb-1"
        style={{
          ...isActive('/gestor'),
          backgroundColor: location.pathname === '/gestor' ? '#eff6ff' : 'transparent',
        }}>
        🏠 <span className="fw-semibold">HOME</span>
      </Link>

      <hr className="my-2" />

      {/* Listar Solicitações */}
      <Link
        to="/gestor/solicitacoes"
        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded mb-1"
        style={{
          ...isActive('/gestor/solicitacoes'),
          backgroundColor: location.pathname === '/gestor/solicitacoes' ? '#eff6ff' : 'transparent',
        }}>
        📋 <span className="fw-semibold">Listar Solicitações</span>
      </Link>

      <hr className="my-2" />

      {/* Atualizar */}
      <Link
        to="/gestor/atualizar"
        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded"
        style={{
          ...isActive('/gestor/atualizar'),
          backgroundColor: location.pathname === '/gestor/atualizar' ? '#eff6ff' : 'transparent',
        }}>
        ✏️ <span className="fw-semibold">Atualizar</span>
      </Link>
    </div>
  );
}

export default Sidebar;