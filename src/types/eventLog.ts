export interface EventLog {
  _id: string;
  userName: string;
  companyName: string;
  companyId: string;
  route: string;
  method: string;
  action: string;
  status: string;
  message: string;
  createdAt: string;
  device?: string;
}

export interface EventLogFilters {
  companyId?: string;
  startDate?: string;
  endDate?: string;
}
