import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react';

const API_URL = 'http://localhost:3001/api';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  login: (email: string, password: string, captcha: string) => Promise<boolean | 'captcha'>;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Não autenticado');

      const data = await response.json();
      console.log('[Perfil carregado]', data);
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[Erro ao buscar perfil]', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
  if (!user && !isAuthenticated) return; // Evita chamada precoce
  fetchUserProfile();
}, [user, isAuthenticated]);


  const login = useCallback(
    async (email: string, password: string, captcha: string): Promise<boolean | 'captcha'> => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, captcha })
        });

        const data = await response.json();

        if (response.status === 400 && data?.error?.toLowerCase().includes('captcha')) {
          return 'captcha';
        }

        if (!response.ok || !data.user) return false;

        await new Promise(resolve => setTimeout(resolve, 200));
        await fetchUserProfile();
        return true;
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        return false;
      }
    },
    [fetchUserProfile]
  );

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    // Você pode adicionar chamada para um endpoint /auth/logout se quiser
  }, []);

  const contextValue: AuthContextType = {
    login,
    logout,
    isAuthenticated,
    user,
    isLoading
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