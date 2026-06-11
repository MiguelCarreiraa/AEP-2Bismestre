import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
      ? { color: '#2563eb', fontWeight: 700, backgroundColor: '#eff6ff' }
      : { color: '#475569', backgroundColor: 'transparent' };

  return (
    <div
      className="d-flex flex-column p-3 bg-light border-end"
      style={{ width: '190px', minHeight: '100%', flexShrink: 0 }}>

      {/* HOME */}
      <Link
        to="/gestor"
        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded mb-1"
        style={isActive('/gestor')}>
        🏠 <span className="fw-semibold">HOME</span>
      </Link>

      <hr className="my-2" />

      {/* Listar Solicitações */}
      <Link
        to="/gestor/solicitacoes"
        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded mb-1"
        style={isActive('/gestor/solicitacoes')}>
        📋 <span className="fw-semibold">Listar Solicitações</span>
      </Link>

      <hr className="my-2" />

      {/* Atualizar — agora vai para /gestor/atualizar que abre
          o formulário de busca por protocolo direto */}
      <Link
        to="/gestor/atualizar"
        className="text-decoration-none d-flex align-items-center gap-2 py-2 px-2 rounded"
        style={isActive('/gestor/atualizar')}>
        ✏️ <span className="fw-semibold">Atualizar</span>
      </Link>
    </div>
  );
}

export default Sidebar;