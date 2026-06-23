export type UserRole = "student" | "teacher";

export interface LoggedPerson {
  x: number;
  y: number;
  label: string;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  timestamp: string;
  className: string;
  roomName: string;
  count: number;
  confidence?: number;
  summary: string;
  people: LoggedPerson[];
  teacherName: string;
  status: "completed" | "flagged";
  isEmulated?: boolean;
}

export interface ClassSession {
  id: string;
  name: string;
  room: string;
  schedule: string;
  enrolled: number;
  code: string;
}
