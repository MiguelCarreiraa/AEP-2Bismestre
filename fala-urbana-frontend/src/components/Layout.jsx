import Navbar from './Navbar';
import Footer from './Footer';

// ============================================================
// COMPONENTE: Layout
// Resolve o problema do Footer inconsistente.
//
// Antes: cada página adicionava (ou não) Navbar e Footer manualmente.
// Depois: todas as páginas que usam Layout recebem automaticamente:
//   - Navbar no topo
//   - Conteúdo no meio (flex-grow-1 faz crescer e empurra o footer)
//   - Footer no rodapé (sempre no final, nunca flutuando)
//
// Uso:
//   <Layout>
//     <div>conteúdo da página</div>
//   </Layout>
//
// Para páginas do gestor (que têm sidebar própria), use GestorLayout.
// ============================================================
function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;