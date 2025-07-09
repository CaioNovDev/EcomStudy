import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// Centralize a URL da API em um único local
const API_URL = 'http://localhost:3001/api';

interface AuthContextType {
  login: (email: string, password: string, captcha: string) => Promise<boolean | 'captcha'>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    // Tenta carregar o token do localStorage ao iniciar
    return localStorage.getItem('token');
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Atualiza o estado de autenticação ao alterar o token
  useEffect(() => {
    setIsAuthenticated(!!token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Função de login (mantém tipagem e retornos claros)
  const login = useCallback(
    async (email: string, password: string, captcha: string): Promise<boolean | 'captcha'> => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, captcha }),
        });

        if (response.status === 400) {
          const data = await response.json();
          if (data.error && data.error.toLowerCase().includes('captcha')) {
            return 'captcha';
          }
          return false;
        }

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        setToken(data.token);
        return true;
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        return false;
      }
    },
    []
  );

  // Função de logout (limpa token)
  const logout = useCallback(() => {
    setToken(null);
    // Se quiser, pode também fazer um fetch para API de logout aqui.
  }, []);

  // Valor do contexto
  const contextValue: AuthContextType = {
    login,
    logout,
    isAuthenticated,
    token,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook customizado para usar o contexto
export const useAuth = () => useContext(AuthContext);