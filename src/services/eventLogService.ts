import api from "./api";
import { EventLog, EventLogFilters } from "../types/eventLog";

export async function listEventLogs(params?: EventLogFilters) {
  const { data } = await api.get<EventLog[]>("/event-logs", { params });
  return data;
}

export async function deleteEventLogs(month: string, year: string) {
  const { data } = await api.delete<{ message?: string }>("/delete-event", {
    params: { month, year },
  });

  return data;
}
