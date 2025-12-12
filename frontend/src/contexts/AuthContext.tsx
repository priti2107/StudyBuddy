import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

/* ---------------------------------------------------
   UPDATED USER TYPE → Fixes your "name does not exist" errors
--------------------------------------------------- */
export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /* ---------------------------------------------------
     LOAD USER FROM LOCALSTORAGE
  --------------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem('studybuddy_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------------------------------------------------
     SIGNUP → Django API
  --------------------------------------------------- */
  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error(err.error || "Signup failed");
        return false;
      }

      toast.success("Account created successfully! Please log in.");
      return true;

    } catch (err) {
      toast.error("Signup error");
      return false;
    }
  };

  /* ---------------------------------------------------
     LOGIN → Django JWT
  --------------------------------------------------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error("Invalid email or password");
        return false;
      }

      const data = await response.json();

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // NEW USER OBJECT (includes name)
      const newUser: User = {
        name: email.split("@")[0], // temporary name until user edits
        email
      };

      setUser(newUser);
      localStorage.setItem("studybuddy_user", JSON.stringify(newUser));

      toast.success("Welcome back!");
      return true;

    } catch (err) {
      toast.error("Login error");
      return false;
    }
  };

  /* ---------------------------------------------------
     LOGOUT
  --------------------------------------------------- */
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("studybuddy_user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  /* ---------------------------------------------------
     UPDATE USER (Profile Settings Page)
     Fixes both TS errors you posted.
  --------------------------------------------------- */
  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser: User = { ...user, ...updates };

    setUser(updatedUser);
    localStorage.setItem("studybuddy_user", JSON.stringify(updatedUser));

    toast.success("Profile updated");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
