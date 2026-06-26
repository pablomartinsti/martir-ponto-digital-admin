import api from "./api";
import { CreateEmployeeDTO, Employee, ListEmployeesParams } from "../types/employee";

export async function createEmployee(payload: CreateEmployeeDTO) {
  const { data } = await api.post<Employee>("/employees", payload);
  return data;
}

export async function listEmployees(params?: ListEmployeesParams) {
  const { data } = await api.get<Employee[]>("/employees", { params });
  return data;
}

export async function listActiveEmployees() {
  return listEmployees({ filter: "active" });
}

export async function updateEmployeeStatus(employeeId: string, isActive: boolean) {
  const { data } = await api.patch<Employee>(`/employees/${employeeId}/status`, {
    isActive,
  });

  return data;
}

export async function resetEmployeePassword(employeeId: string, newPassword: string) {
  const { data } = await api.put(`/users/${employeeId}/reset-password`, {
    newPassword,
  });

  return data;
}
