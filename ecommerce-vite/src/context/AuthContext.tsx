// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react';

const API_URL = 'http://localhost:3001/api';

interface AuthContextType {
  login: (email: string, password: string, captcha: string) => Promise<boolean | 'captcha'>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    setIsAuthenticated(!!token);

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

 const login = useCallback(
  async (email: string, password: string, captcha: string): Promise<boolean | 'captcha'> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 🔑 Permite enviar o cookie de sessão
        body: JSON.stringify({ email, password, captcha })
      });

      const data = await response.json();

      if (response.status === 400 && data?.error?.toLowerCase().includes('captcha')) {
        return 'captcha';
      }

      if (!response.ok || !data.token) return false;

      setToken(data.token);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  },
  []
);


  const logout = useCallback(() => {
    setToken(null);
    // Você pode adicionar chamada para um endpoint de logout aqui, se houver
  }, []);

  const contextValue: AuthContextType = {
    login,
    logout,
    isAuthenticated,
    token
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};