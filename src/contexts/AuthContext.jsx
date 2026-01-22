import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";
import { getToken, logout as clearAuth } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authApi.getMe();
          console.log("User data loaded:", response.data);
          setUser(response.data.user);
        } catch (error) {
          console.error("Auth init error:", error);
          // Token invalid, clear it
          clearAuth();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credential) => {
    try {
      console.log("Attempting Google login...");
      const response = await authApi.googleLogin(credential);
      console.log("Login response:", response.data);
      const { token, user: userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error config:", error.config);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Login failed" 
      };
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.data.user);
    } catch (error) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

