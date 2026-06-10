import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// ---- Páginas Públicas ----
import Home from './pages/public/Home';
import FAQ from './pages/public/FAQ';
import DetalhesSolicitacao from './pages/public/DetalhesSolicitacao';
import CriarSolicitacaoAnonima from './pages/public/CriarSolicitacaoAnonima';

// Roteador inteligente: mostra a página certa baseado em quem está logado
import NovaSolicitacaoRedirect from './pages/public/NovaSolicitacaoRedirect';

// ---- Páginas do Cidadão ----
import Login from './pages/cidadao/Login';
import Registro from './pages/cidadao/Registro';
import PainelCidadao from './pages/cidadao/PainelCidadao';
import ConfirmarSolicitacoes from './pages/cidadao/ConfirmarSolicitacoes';
import CriarSolicitacaoCidadao from './pages/cidadao/CriarSolicitacaoCidadao';

// ---- Páginas do Gestor ----
import LoginGestor from './pages/gestor/LoginGestor';
import RegistroGestor from './pages/gestor/RegistroGestor';
import DashboardGestor from './pages/gestor/DashboardGestor';
import ListarSolicitacoes from './pages/gestor/ListarSolicitacoes';
import AtualizarSolicitacao from './pages/gestor/AtualizarSolicitacao';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== ÁREA PÚBLICA ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/protocolo/:protocolo" element={<DetalhesSolicitacao />} />
        <Route path="/confirmar-solicitacoes" element={<ConfirmarSolicitacoes />} />

        {/* Rota inteligente: anônimo → banner de privacidade | logado → vincula à conta */}
        <Route path="/nova-solicitacao" element={<NovaSolicitacaoRedirect />} />

        {/* ===== AUTENTICAÇÃO ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/gestor/login" element={<LoginGestor />} />
        <Route path="/gestor/registro" element={<RegistroGestor />} />

        {/* ===== ÁREA DO CIDADÃO ===== */}
        <Route
          path="/cidadao"
          element={
            <ProtectedRoute role="ROLE_CIDADAO">
              <PainelCidadao />
            </ProtectedRoute>
          }
        />

        {/* ===== ÁREA DO GESTOR ===== */}
        <Route
          path="/gestor"
          element={
            <ProtectedRoute role="ROLE_GESTOR">
              <DashboardGestor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/solicitacoes"
          element={
            <ProtectedRoute role="ROLE_GESTOR">
              <ListarSolicitacoes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/solicitacao/:id"
          element={
            <ProtectedRoute role="ROLE_GESTOR">
              <AtualizarSolicitacao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestor/atualizar"
          element={
            <ProtectedRoute role="ROLE_GESTOR">
              <ListarSolicitacoes />
            </ProtectedRoute>
          }
        />

        {/* ===== 404 ===== */}
        <Route path="*" element={
          <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <h1 className="display-1 fw-bold text-muted">404</h1>
              <p className="lead">Página não encontrada</p>
              <a href="/" className="btn btn-primary">Voltar ao início</a>
            </div>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;