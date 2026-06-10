import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE REQUISIÇÃO
// Adiciona o header Authorization automaticamente quando há usuário logado
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('falaurbana_user');
  if (userData) {
    const { email, senha } = JSON.parse(userData);
    const credentials = btoa(`${email}:${senha}`);
    config.headers.Authorization = `Basic ${credentials}`;
  }
  return config;
});

// INTERCEPTOR DE RESPOSTA
// CORREÇÃO: apenas redireciona para /login em 401 se o usuário ESTAVA logado.
// Antes: qualquer 401 redirecionava, incluindo em rotas públicas que podem
// retornar 401 se o servidor tiver alguma configuração extra. Isso mascarava
// o erro real e causava loops de redirecionamento.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const userData = localStorage.getItem('falaurbana_user');
      // Só redireciona se havia um usuário logado (sessão expirada)
      if (userData) {
        localStorage.removeItem('falaurbana_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;