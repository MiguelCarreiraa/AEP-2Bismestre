import { Link } from 'react-router-dom';

// ============================================================
// Footer baseado na imagem de referência:
// - Fundo azul escuro (#0a2463)
// - 3 botões verdes no topo (Calendário, Acesso, Mapa do Site)
// - Linha divisória
// - Logo à esquerda, redes sociais à direita
// - Linha com links de navegação rápida
// - Botões especiais: Login Gestor / Registrar-se como Gestor
// ============================================================
function Footer() {
  return (
    <footer style={{ backgroundColor: '#0a2463', color: '#fff' }}>

      {/* Faixa superior — botões verdes + "Voltar ao topo" */}
      <div className="container-fluid px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/confirmar-solicitacoes"
            className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
            style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none' }}>
            🗺️ Confirmar Solicitações
          </Link>
          <Link to="/nova-solicitacao"
            className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
            style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none' }}>
            📋 Nova Solicitação
          </Link>
          <Link to="/faq"
            className="btn btn-sm fw-semibold d-flex align-items-center gap-1"
            style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none' }}>
            ❓ FAQ
          </Link>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn btn-link text-white fw-semibold text-decoration-none p-0"
          style={{ fontSize: '0.875rem' }}>
          Voltar ao topo ↑
        </button>
      </div>

      {/* Linha principal — logo + redes sociais */}
      <div className="container py-4">
        <div className="row align-items-center">

          {/* Logo */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="fw-bold fs-3 mb-1">
              <span style={{ color: '#60a5fa' }}>fala</span>Urbana
            </div>
            <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Portal de Participação Cidadã
            </p>
          </div>

          {/* Navegação rápida */}
          <div className="col-md-4 mb-3 mb-md-0">
            <p className="fw-semibold mb-2 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              NAVEGAÇÃO
            </p>
            <div className="d-flex flex-column gap-1">
              <Link to="/" className="text-white-50 text-decoration-none small">Início</Link>
              <Link to="/nova-solicitacao" className="text-white-50 text-decoration-none small">Criar Solicitação</Link>
              <Link to="/confirmar-solicitacoes" className="text-white-50 text-decoration-none small">Confirmar Solicitações</Link>
              <Link to="/faq" className="text-white-50 text-decoration-none small">Perguntas Frequentes</Link>
            </div>
          </div>

          {/* Área do gestor + redes sociais */}
          <div className="col-md-4">
            <p className="fw-semibold mb-2 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ÁREA DO GESTOR
            </p>
            <div className="d-flex flex-column gap-2 mb-3">
              <Link to="/gestor/login"
                className="btn btn-sm fw-semibold"
                style={{ backgroundColor: '#1e40af', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                🔐 Login Gestor
              </Link>
              <Link to="/gestor/registro"
                className="btn btn-sm fw-semibold"
                style={{ backgroundColor: 'transparent', color: '#60a5fa', border: '1px solid #60a5fa' }}>
                📝 Registrar-se como Gestor
              </Link>
            </div>

            {/* Redes sociais */}
            <p className="fw-semibold mb-2 small" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ACOMPANHE NAS REDES
            </p>
            <div className="d-flex gap-3">
              {[
                { icon: '📘', label: 'Facebook', href: '#' },
                { icon: '🐦', label: 'Twitter/X', href: '#' },
                { icon: '📸', label: 'Instagram', href: '#' },
                { icon: '💼', label: 'LinkedIn', href: '#' },
                { icon: '▶️', label: 'YouTube', href: '#' },
              ].map(({ icon, label, href }) => (
                <a key={label} href={href}
                   title={label}
                   className="text-white text-decoration-none"
                   style={{ fontSize: '1.3rem', opacity: 0.8 }}
                   target="_blank" rel="noreferrer">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <div className="container py-2">
          <p className="mb-0 text-center small" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} falaUrbana — Projeto Acadêmico UniCesumar &nbsp;|&nbsp;
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;