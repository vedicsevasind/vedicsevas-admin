import { createContext, useContext, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load saved admin from localStorage (so you stay logged in on refresh)
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('vs_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });

    if (!data.user.isAdmin) {
      throw new Error('This account does not have admin access');
    }

    // Save to localStorage so it persists after page refresh
    localStorage.setItem('vs_admin_token', data.token);
    localStorage.setItem('vs_admin_user', JSON.stringify(data.user));
    setAdmin(data.user);
  };

  const logout = () => {
    localStorage.removeItem('vs_admin_token');
    localStorage.removeItem('vs_admin_user');
    setAdmin(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so any component can use auth easily
export const useAuth = () => useContext(AuthContext);