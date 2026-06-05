export type ProcessType = 'Datasource' | 'Workbook';
export type ProcessStatus = 'Succeeded' | 'Failed';
export type ProcessFilter = ProcessType | 'All';

export interface DailyFailureSummary {
  date: string;
  label: string;
  failureRate: number;
  failedTasks: number;
  totalTasks: number;
}

export interface ProcessRun {
  id: string;
  processName: string;
  type: ProcessType;
  date: string;
  status: ProcessStatus;
  scheduledStart: string;
  actualStart: string;
  durationMinutes: number;
  averageDurationMinutes: number;
  errorMessage?: string;
}

export interface ProcessHistoryRun {
  id: string;
  processName: string;
  date: string;
  status: ProcessStatus;
  actualStart: string;
  durationMinutes: number;
  averageDurationMinutes: number;
}

export interface TimelineScale {
  startHour: number;
  endHour: number;
  width: number;
}
