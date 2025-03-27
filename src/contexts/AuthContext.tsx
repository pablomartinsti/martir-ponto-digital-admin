// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface User {
  name: string;
  role: "admin" | "employee";
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // <-- novo estado

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (tokenStorage && userStorage) {
      setToken(tokenStorage);
      setUser(JSON.parse(userStorage));
      api.defaults.headers.common["Authorization"] = `Bearer ${tokenStorage}`;
    }

    setLoading(false); // <-- fim da restauração
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
