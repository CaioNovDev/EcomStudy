import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  login: (email: string, senha: string, captcha: string) => Promise<boolean | 'captcha'>;
  // Você pode adicionar logout, isAuthenticated, etc.
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);

  const login = async (
    email: string,
    senha: string,
    captcha: string
  ): Promise<boolean | 'captcha'> => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Necessário para cookies de sessão
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: senha,
          captcha: captcha,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        if (data.error === 'Captcha incorreto') {
          return 'captcha';
        }
        return false;
      }

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      setToken(data.token);
      // localStorage.setItem('token', data.token); // opcional: persistência
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
