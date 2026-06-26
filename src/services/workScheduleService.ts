import api from "./api";
import { SaveWorkScheduleDTO, WorkSchedule } from "../types/workSchedule";

export async function getWorkScheduleByEmployee(employeeId: string) {
  const { data } = await api.get<WorkSchedule>(`/work-schedules/${employeeId}`);
  return data;
}

export async function saveWorkSchedule(payload: SaveWorkScheduleDTO) {
  const { data } = await api.post<WorkSchedule>("/work-schedules", payload);
  return data;
}
