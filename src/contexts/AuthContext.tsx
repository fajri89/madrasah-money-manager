
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/utils/api';

// Define user interface
export interface User {
  id: number;
  username: string;
  nama: string;
  level: 'admin' | 'bendahara' | 'kepala_sekolah';
}

// Define context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (roles: string[]) => boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await api.login(username, password);
      
      if (response.success) {
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          nama: response.user.nama,
          level: response.user.level as 'admin' | 'bendahara' | 'kepala_sekolah'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success(`Selamat datang, ${userData.nama}`);
        navigate('/');
        return true;
      } else {
        toast.error(response.message || 'Login gagal');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Terjadi kesalahan saat login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Anda telah keluar dari sistem');
    navigate('/login');
  };

  // Check if user has permission based on role
  const hasPermission = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.level);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
