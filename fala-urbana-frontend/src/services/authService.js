import api from './api';

const authService = {
  
  // POST /auth/login
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  },

  // POST /auth/register
  registrar: async (dados) => {
    const response = await api.post('/auth/register', dados);
    return response.data;
  },
};

export default authService;