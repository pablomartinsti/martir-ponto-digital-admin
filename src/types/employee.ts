import { UserRole } from "./auth";

export type EmployeeFilter = "active" | "inactive";

export interface Employee {
  _id: string;
  name: string;
  cpf: string;
  position?: string;
  isActive: boolean;
  role: UserRole;
}

export interface CreateEmployeeDTO {
  name: string;
  cpf: string;
  password: string;
  position: string;
}

export interface ListEmployeesParams {
  filter?: EmployeeFilter;
  cnpj?: string;
}
