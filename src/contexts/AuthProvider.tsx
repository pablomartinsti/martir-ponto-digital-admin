import { useState, useEffect } from "react";
import { AuthContext, AuthContextData } from "./AuthContext";
import api from "../services/api";

interface User {
  name: string;
  role: "admin" | "employee" | "sub_admin";
  companyId?: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (tokenStorage && userStorage) {
      setToken(tokenStorage);
      setUser(JSON.parse(userStorage));
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenStorage}`;
    }

    setLoading(false);
  }, []);

  function login(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  }

  const contextValue: AuthContextData = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
