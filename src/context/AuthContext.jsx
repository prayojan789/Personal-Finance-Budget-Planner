/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("budget-planner-user", null);

  const login = (email, password) => {
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 6) {
      const mockUser = {
        id: Date.now(),
        email,
        name: email.split("@")[0],
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const register = (name, email, password) => {
    // Mock registration - in real app, this would call an API
    if (name && email && password.length >= 6) {
      const mockUser = {
        id: Date.now(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      return { success: true, user: mockUser };
    }
    return { success: false, error: "Invalid registration data" };
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
