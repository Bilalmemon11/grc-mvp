import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  roles: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = API_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // Add auth token to requests if available
  const token = localStorage.getItem('accessToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data.user);
          setRoles(response.data.data.roles || []);
        }
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Fetch user details
        const meResponse = await axios.get('/auth/me');
        if (meResponse.data.success) {
          setUser(meResponse.data.data.user);
          setRoles(meResponse.data.data.roles || []);
        } else {
          setUser(user);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await axios.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Set user
        setUser(user);
        setRoles(['Viewer']); // Default role for new users
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];

    // Clear user state
    setUser(null);
    setRoles([]);
  };

  const value = {
    user,
    roles,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
