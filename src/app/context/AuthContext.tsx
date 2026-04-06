import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "../config";

interface User {
  id?: number | string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("hydroponics_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userObj = data.user;
        setUser(userObj);
        localStorage.setItem("hydroponics_user", JSON.stringify(userObj));
        return { success: true };
      } else {
        return { success: false, message: data.error || "Login failed" };
      }
    } catch (err) {
      return { success: false, message: "Network error. Please ensure the backend is running." };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const userObj = data.user;
        setUser(userObj);
        localStorage.setItem("hydroponics_user", JSON.stringify(userObj));
        return { success: true };
      } else {
        return { success: false, message: data.error || "Registration failed" };
      }
    } catch (err) {
      return { success: false, message: "Network error. Please ensure the backend is running." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hydroponics_user");
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...data };
      localStorage.setItem("hydroponics_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
