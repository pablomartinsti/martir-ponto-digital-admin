export type AbsenceType =
  | "vacation"
  | "sick_leave"
  | "justified"
  | "day_off"
  | "holiday"
  | "unjustified";

export interface CreateAbsenceDTO {
  employeeId: string;
  date: string;
  type: AbsenceType;
  description?: string;
}
