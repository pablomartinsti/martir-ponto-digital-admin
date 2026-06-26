export type UserRole = "admin" | "sub_admin" | "employee";

export interface AuthUser {
  id?: string;
  name: string;
  role: UserRole;
  companyId?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
