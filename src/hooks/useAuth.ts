import { useState, useEffect, createContext, useContext } from 'react';

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
    // Check for existing session
    const savedUser = localStorage.getItem('positivaUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('positivaUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call to PocketBase
      // In real implementation, this would call your PocketBase backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        
        setUser(mockUser);
        localStorage.setItem('positivaUser', JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('positivaUser');
  };

  return {
    user,
    login,
    logout,
    isLoading,
  };
};

export { AuthContext };