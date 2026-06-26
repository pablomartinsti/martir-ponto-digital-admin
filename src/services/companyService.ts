import api from "./api";
import { Company, CreateSubAdminAndCompanyDTO } from "../types/company";

export async function listCompanies() {
  const { data } = await api.get<Company[]>("/companies");
  return data;
}

export async function createSubAdminAndCompany(payload: CreateSubAdminAndCompanyDTO) {
  const { data } = await api.post("/sub-admin", payload);
  return data;
}
