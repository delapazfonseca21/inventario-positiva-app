import { useState, useEffect, createContext, useContext } from 'react';
import { pb, Empleado } from '@/lib/pocketbase';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa en PocketBase
    if (pb.authStore.isValid && pb.authStore.model) {
      const authModel = pb.authStore.model as any;
      setUser({
        id: authModel.id,
        email: authModel.email,
        name: authModel.name,
        createdAt: authModel.created,
      });
    }
    setIsLoading(false);

    // Listener para cambios en la autenticación
    pb.authStore.onChange(() => {
      if (pb.authStore.model) {
        const authModel = pb.authStore.model as any;
        setUser({
          id: authModel.id,
          email: authModel.email,
          name: authModel.name,
          createdAt: authModel.created,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Autenticar con PocketBase usando la colección 'empleados'
      const authData = await pb.collection('empleados').authWithPassword(email, password);
      
      if (authData?.record) {
        const empleado = authData.record as any;
        setUser({
          id: empleado.id,
          email: empleado.email,
          name: empleado.name,
          createdAt: empleado.created,
        });
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isLoading,
  };
};

export { AuthContext };