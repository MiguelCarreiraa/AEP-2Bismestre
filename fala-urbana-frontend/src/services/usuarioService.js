import api from './api';

const usuarioService = {

  // GET /usuarios/perfil — retorna dados do usuário logado
  meuPerfil: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  // PUT /usuarios/perfil — atualiza nome e cpf
  atualizarPerfil: async (dados) => {
    const response = await api.put('/usuarios/perfil', dados);
    return response.data;
  },

  // PUT /usuarios/senha — altera senha
  alterarSenha: async (dados) => {
    // dados: { senhaAtual, novaSenha }
    const response = await api.put('/usuarios/senha', dados);
    return response.data;
  },
};

export default usuarioService;