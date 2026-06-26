export interface Company {
  _id: string;
  name: string;
  cnpj: string;
}

export interface CreateSubAdminAndCompanyDTO {
  name: string;
  cpf: string;
  password: string;
  companyName: string;
  cnpj: string;
  position: string;
  latitude: number;
  longitude: number;
}
