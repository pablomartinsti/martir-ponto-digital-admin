import api from "./api";
import { LoginResponse } from "../types/auth";

export async function signIn(cpf: string, password: string) {
  const { data } = await api.post<LoginResponse>("/login", {
    cpf,
    password,
  });

  return data;
}
