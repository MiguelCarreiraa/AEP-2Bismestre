import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  // Estado global para toast de logout
  const [logoutMsg, setLogoutMsg] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('falaurbana_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const data = response.data;

      // CORREÇÃO: garante que tipo seja sempre string
      // O backend agora retorna .name() mas protegemos aqui também
      const tipoStr = typeof data.tipo === 'object'
        ? Object.keys(data.tipo)[0]   // fallback se vier como objeto
        : String(data.tipo);

      const userData = {
        email,
        senha,
        nome: data.nome || email,
        tipo: tipoStr,
      };

      setUser(userData);
      localStorage.setItem('falaurbana_user', JSON.stringify(userData));
      return { success: true, data: userData };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email ou senha incorretos',
      };
    }
  };

  // CORRIGIDO: logout mostra feedback visual antes de limpar
  const logout = useCallback((redirectTo = '/') => {
    setUser(null);
    localStorage.removeItem('falaurbana_user');
    setLogoutMsg(true);
    // Esconde a mensagem após 2.5s e redireciona
    setTimeout(() => {
      setLogoutMsg(false);
      window.location.href = redirectTo;
    }, 2500);
  }, []);

  // Atualiza dados do usuário no contexto (ex: após editar perfil)
  const updateUser = useCallback((novosDados) => {
    setUser(prev => {
      const atualizado = { ...prev, ...novosDados };
      localStorage.setItem('falaurbana_user', JSON.stringify(atualizado));
      return atualizado;
    });
  }, []);

  const isGestor       = () => user?.tipo === 'ROLE_GESTOR';
  const isCidadao      = () => user?.tipo === 'ROLE_CIDADAO';
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, updateUser,
      isGestor, isCidadao, isAuthenticated,
    }}>
      {/* Toast de logout — aparece em qualquer página */}
      {logoutMsg && (
        <div
          style={{
            position: 'fixed', top: 20, right: 20, zIndex: 9999,
            backgroundColor: '#198754', color: '#fff',
            padding: '12px 20px', borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'fadeIn 0.3s ease',
          }}>
          ✅ Logout realizado com sucesso!
        </div>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}