import { createContext } from "react";

interface User {
  name: string;
  role: "admin" | "employee" | "sub_admin";
  companyId?: string;
}

export interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
