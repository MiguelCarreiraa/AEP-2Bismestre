import api from './api';

const solicitacaoService = {

  // ====== PÚBLICAS ======

  criar: async (solicitacao) => {
    const r = await api.post('/solicitacoes', solicitacao);
    return r.data;
  },

  buscarPorProtocolo: async (protocolo) => {
    const r = await api.get(`/solicitacoes/protocolo/${protocolo}`);
    return r.data;
  },

  buscarPorId: async (id) => {
    const r = await api.get(`/solicitacoes/${id}`);
    return r.data;
  },

  buscarHistorico: async (id) => {
    const r = await api.get(`/solicitacoes/${id}/historico`);
    return r.data;
  },

  listarPublicas: async () => {
    const r = await api.get('/solicitacoes/publicas');
    return r.data;
  },

  // Sempre retorna { ok, data?, jaConfirmou?, mensagem? }
  // Nunca lança exceção — o componente não precisa de try/catch
  confirmarOcorrencia: async (id) => {
    try {
      const r = await api.put(`/solicitacoes/${id}/confirmar`);
      return { ok: true, data: r.data };
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        return {
          ok: false,
          jaConfirmou: true,
          mensagem: err.response?.data?.mensagem || 'Você já confirmou esta solicitação.',
        };
      }
      if (status === 401) {
        return {
          ok: false,
          jaConfirmou: false,
          mensagem: 'Você precisa estar logado para confirmar.',
        };
      }
      // Qualquer outro erro retorna genérico — sem re-lançar
      return {
        ok: false,
        jaConfirmou: false,
        mensagem: 'Erro ao confirmar. Tente novamente.',
      };
    }
  },

  // ====== CIDADÃO ======

  minhasSolicitacoes: async () => {
    const r = await api.get('/solicitacoes/minhas');
    return r.data;
  },

  // ====== GESTOR ======

  listarTodas: async () => {
    const r = await api.get('/solicitacoes');
    return r.data;
  },

  buscarPorStatus: async (status) => {
    const r = await api.get(`/solicitacoes/status/${status}`);
    return r.data;
  },

  buscarPorCategoria: async (categoria) => {
    const r = await api.get(`/solicitacoes/categoria/${categoria}`);
    return r.data;
  },

  buscarPorBairro: async (bairro) => {
    const r = await api.get(`/solicitacoes/bairro/${encodeURIComponent(bairro)}`);
    return r.data;
  },

  buscarPorLocal: async (localTipo) => {
    const r = await api.get(`/solicitacoes/local/${localTipo}`);
    return r.data;
  },

  atualizarStatus: async (id, status, comentario = '') => {
    const r = await api.put(`/solicitacoes/${id}/status`, { status, comentario });
    return r.data;
  },

  atualizar: async (id, dados) => {
    const r = await api.put(`/solicitacoes/${id}`, dados);
    return r.data;
  },

  deletar: async (id) => {
    await api.delete(`/solicitacoes/${id}`);
  },
};

export default solicitacaoService;