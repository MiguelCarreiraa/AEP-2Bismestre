import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rotas por perfil.
 * 
 * Uso:
 * <ProtectedRoute role="ROLE_GESTOR">
 *   <DashboardGestor />
 * </ProtectedRoute>
 */
function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Se foi especificado um papel (role) e o usuário não tem esse papel
  if (role && user.tipo !== role) {
    // Redireciona para a página correta baseado no papel do usuário
    if (user.tipo === 'ROLE_GESTOR') {
      return <Navigate to="/gestor" replace />;
    }
    return <Navigate to="/cidadao" replace />;
  }

  // Tudo certo: renderiza o componente filho
  return children;
}

export default ProtectedRoute;