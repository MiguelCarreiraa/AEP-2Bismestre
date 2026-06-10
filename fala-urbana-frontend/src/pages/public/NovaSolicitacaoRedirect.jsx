import { useAuth } from '../../context/AuthContext';
import CriarSolicitacaoAnonima from './CriarSolicitacaoAnonima';
import CriarSolicitacaoCidadao from '../cidadao/CriarSolicitacaoCidadao';

// Componente roteador inteligente.
// Mesma URL /nova-solicitacao para todos, mas renderiza
// a página certa baseado em quem está logado:
//   - Não logado ou anônimo → página com banner de privacidade
//   - Cidadão logado        → página vinculada à conta
//   - Gestor logado         → também a página do cidadão (gestores
//                             raramente criam solicitações mas
//                             funciona corretamente)

function NovaSolicitacaoRedirect() {
  const { isAuthenticated, isGestor } = useAuth();

  if (isAuthenticated() && !isGestor()) {
    return <CriarSolicitacaoCidadao />;
  }

  return <CriarSolicitacaoAnonima />;
}

export default NovaSolicitacaoRedirect;