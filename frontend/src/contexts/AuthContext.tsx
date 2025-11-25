import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('studybuddy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('studybuddy_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      toast.error('Email already registered');
      return false;
    }

    const newUser: User = {
      id: Date.now(),
      name,
      email,
      avatar: null,
    };

    users.push({ ...newUser, password });
    localStorage.setItem('studybuddy_users', JSON.stringify(users));
    localStorage.setItem('studybuddy_user', JSON.stringify(newUser));
    setUser(newUser);
    toast.success('Account created successfully!');
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('studybuddy_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      toast.error('Invalid email or password');
      return false;
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    localStorage.setItem('studybuddy_user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    toast.success('Welcome back!');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('studybuddy_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('studybuddy_user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('studybuddy_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('studybuddy_users', JSON.stringify(users));
    }
    
    toast.success('Profile updated successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
