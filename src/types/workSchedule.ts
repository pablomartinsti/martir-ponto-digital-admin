export interface WorkScheduleDay {
  day: string;
  start: string;
  end: string;
  hasLunch: boolean;
  expectedLunchBreakMinutes: number;
  isDayOff: boolean;
}

export interface WorkSchedule {
  _id?: string;
  employeeId: string;
  customDays: WorkScheduleDay[];
}

export interface SaveWorkScheduleDTO {
  employeeId: string;
  customDays: WorkScheduleDay[];
}
