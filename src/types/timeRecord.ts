export interface TimeRecord {
  _id?: string;
  date: string;
  clockIn?: string;
  lunchStart?: string;
  lunchEnd?: string;
  clockOut?: string;
  workedHours: string;
  balance: string;
  status: string;
  justified?: boolean;
  description?: string;
}

export interface TimeRecordsResponse {
  records: TimeRecord[];
  totalPositiveHours?: string;
  totalNegativeHours?: string;
  finalBalance?: string;
}

export interface GetTimeRecordsParams {
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
  employeeId?: string;
}
