import api from "./api";
import { CreateAbsenceDTO } from "../types/absence";

export async function createAbsence(payload: CreateAbsenceDTO) {
  const { data } = await api.post("/absences", payload);
  return data;
}
