import api from "./api";
import { GetTimeRecordsParams, TimeRecordsResponse } from "../types/timeRecord";

export async function getTimeRecords(params: GetTimeRecordsParams) {
  const { data } = await api.get<TimeRecordsResponse>("/time-records", {
    params,
  });

  return data;
}
