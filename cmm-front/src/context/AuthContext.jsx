import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cmm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (authData) => {
    localStorage.setItem('cmm_token', authData.token);
    const userData = {
      id: authData.id,
      nome: authData.nome,
      email: authData.email,
      perfil: authData.perfil,
      especialidade: authData.especialidade,
    };
    localStorage.setItem('cmm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cmm_token');
    localStorage.removeItem('cmm_user');
    setUser(null);
  };

  const isGestor = user?.perfil === 'GESTOR';
  const isTecnico = user?.perfil === 'TECNICO';
  const isSolicitante = user?.perfil === 'SOLICITANTE';

  return (
    <AuthContext.Provider value={{ user, login, logout, isGestor, isTecnico, isSolicitante }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
