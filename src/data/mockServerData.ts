import type {
  DailyFailureSummary,
  ProcessHistoryRun,
  ProcessRun,
  ProcessStatus,
  ProcessType,
} from '../types';

export const DEFAULT_DATE = '2016-03-20';

interface ProcessTemplate {
  slug: string;
  processName: string;
  type: ProcessType;
  scheduledTime: string;
  averageDurationMinutes: number;
}

interface RunOverride {
  status?: ProcessStatus;
  delayMinutes?: number;
  durationMinutes?: number;
  errorMessage?: string;
}

interface DaySpec {
  date: string;
  count: number;
  overrides: Record<string, RunOverride>;
}

interface HistorySpec {
  processName: string;
  slug: string;
  averageDurationMinutes: number;
  startTime: string;
  failedDates: string[];
  durationOverrides?: Record<string, number>;
  startOverrides?: Record<string, string>;
}

const processCatalog: ProcessTemplate[] = [
  {
    slug: 'radiant-orders',
    processName: 'Epic Radiant Orders',
    type: 'Datasource',
    scheduledTime: '10:30',
    averageDurationMinutes: 124.93,
  },
  {
    slug: 'asap-events',
    processName: 'Epic ASAP Events',
    type: 'Datasource',
    scheduledTime: '11:00',
    averageDurationMinutes: 45.2,
  },
  {
    slug: 'medication-charges',
    processName: 'Epic Medication Charges',
    type: 'Workbook',
    scheduledTime: '12:00',
    averageDurationMinutes: 41.5,
  },
  {
    slug: 'claim-aging',
    processName: 'Revenue Cycle Claim Aging',
    type: 'Datasource',
    scheduledTime: '13:30',
    averageDurationMinutes: 38.0,
  },
  {
    slug: 'mychart-status',
    processName: 'Epic MyChart Status',
    type: 'Workbook',
    scheduledTime: '09:00',
    averageDurationMinutes: 18.8,
  },
  {
    slug: 'bed-board',
    processName: 'Epic Bed Board Census',
    type: 'Datasource',
    scheduledTime: '07:00',
    averageDurationMinutes: 15.9,
  },
  {
    slug: 'surgical-case-volume',
    processName: 'Surgical Case Volume',
    type: 'Workbook',
    scheduledTime: '08:15',
    averageDurationMinutes: 30.1,
  },
  {
    slug: 'sepsis-warning',
    processName: 'Sepsis Early Warning',
    type: 'Workbook',
    scheduledTime: '08:45',
    averageDurationMinutes: 17.5,
  },
  {
    slug: 'refill-queue',
    processName: 'Pharmacy Refill Queue',
    type: 'Datasource',
    scheduledTime: '09:30',
    averageDurationMinutes: 21.0,
  },
  {
    slug: 'lab-turnaround',
    processName: 'Lab Result Turnaround',
    type: 'Workbook',
    scheduledTime: '10:00',
    averageDurationMinutes: 20.4,
  },
  {
    slug: 'encounter-arrival',
    processName: 'Encounter Arrival Feed',
    type: 'Datasource',
    scheduledTime: '14:00',
    averageDurationMinutes: 29.6,
  },
  {
    slug: 'access-wait-times',
    processName: 'Patient Access Wait Times',
    type: 'Workbook',
    scheduledTime: '15:00',
    averageDurationMinutes: 24.7,
  },
  {
    slug: 'inpatient-census',
    processName: 'Inpatient Census Snapshot',
    type: 'Datasource',
    scheduledTime: '05:45',
    averageDurationMinutes: 19.6,
  },
  {
    slug: 'or-utilization',
    processName: 'OR Utilization Summary',
    type: 'Workbook',
    scheduledTime: '06:30',
    averageDurationMinutes: 34.2,
  },
  {
    slug: 'claims-denial',
    processName: 'Claims Denial Worklist',
    type: 'Datasource',
    scheduledTime: '12:45',
    averageDurationMinutes: 32.8,
  },
  {
    slug: 'radiology-volume',
    processName: 'Radiology Volume Monitor',
    type: 'Workbook',
    scheduledTime: '16:00',
    averageDurationMinutes: 27.4,
  },
  {
    slug: 'ed-throughput',
    processName: 'ED Throughput Dashboard',
    type: 'Workbook',
    scheduledTime: '17:15',
    averageDurationMinutes: 36.5,
  },
  {
    slug: 'supply-par',
    processName: 'Supply PAR Replenishment',
    type: 'Datasource',
    scheduledTime: '18:30',
    averageDurationMinutes: 23.9,
  },
  {
    slug: 'quality-core-measures',
    processName: 'Quality Core Measures',
    type: 'Workbook',
    scheduledTime: '19:00',
    averageDurationMinutes: 44.6,
  },
  {
    slug: 'readmission-risk',
    processName: 'Readmission Risk Scores',
    type: 'Datasource',
    scheduledTime: '20:30',
    averageDurationMinutes: 52.3,
  },
  {
    slug: 'ambulatory-visits',
    processName: 'Ambulatory Visit Volume',
    type: 'Workbook',
    scheduledTime: '21:15',
    averageDurationMinutes: 31.7,
  },
  {
    slug: 'provider-productivity',
    processName: 'Provider Productivity Rollup',
    type: 'Datasource',
    scheduledTime: '22:00',
    averageDurationMinutes: 40.5,
  },
  {
    slug: 'infection-surveillance',
    processName: 'Infection Surveillance Feed',
    type: 'Datasource',
    scheduledTime: '23:15',
    averageDurationMinutes: 48.2,
  },
  {
    slug: 'payer-contracts',
    processName: 'Payer Contract Variance',
    type: 'Workbook',
    scheduledTime: '23:45',
    averageDurationMinutes: 35.8,
  },
];

const daySpecs: DaySpec[] = [
  { date: '2016-03-07', count: 20, overrides: {} },
  {
    date: '2016-03-08',
    count: 21,
    overrides: {
      'claim-aging': {
        status: 'Failed',
        delayMinutes: 18,
        durationMinutes: 74.2,
        errorMessage:
          'ODBC SQL error: payer remittance staging table was unavailable during claim aging refresh.',
      },
    },
  },
  {
    date: '2016-03-09',
    count: 22,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 7,
        durationMinutes: 210.8,
        errorMessage:
          'Tableau Data Engine SQL error: Radiant Orders extract exceeded tempdb workspace limit.',
      },
    },
  },
  {
    date: '2016-03-10',
    count: 20,
    overrides: {
      'readmission-risk': {
        delayMinutes: 32,
        durationMinutes: 87.4,
      },
    },
  },
  {
    date: '2016-03-11',
    count: 19,
    overrides: {
      'medication-charges': {
        status: 'Failed',
        delayMinutes: 8,
        durationMinutes: 91.3,
        errorMessage:
          'Tableau backgrounder failed: duplicate medication charge keys returned from Clarity.',
      },
    },
  },
  {
    date: '2016-03-12',
    count: 21,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 11,
        durationMinutes: 226.9,
        errorMessage:
          'Tableau Data Engine SQL error: Radiant Orders query timed out during extract refresh.',
      },
    },
  },
  {
    date: '2016-03-13',
    count: 22,
    overrides: {
      'asap-events': {
        status: 'Failed',
        delayMinutes: 64,
        durationMinutes: 118.6,
        errorMessage:
          'SQL Server exception: lock request timeout while refreshing emergency department events.',
      },
      'medication-charges': {
        status: 'Failed',
        delayMinutes: 19,
        durationMinutes: 84.1,
        errorMessage:
          'Tableau backgrounder failed: medication charge extract returned duplicate keys.',
      },
      'lab-turnaround': {
        status: 'Failed',
        delayMinutes: 22,
        durationMinutes: 69.5,
        errorMessage:
          'Lab turnaround workbook failed after the LIS extract returned an incomplete batch.',
      },
    },
  },
  { date: '2016-03-14', count: 20, overrides: {} },
  {
    date: '2016-03-15',
    count: 21,
    overrides: {
      'asap-events': {
        status: 'Failed',
        delayMinutes: 16,
        durationMinutes: 99.2,
        errorMessage: 'SQL Server exception: emergency department feed lock timeout.',
      },
    },
  },
  {
    date: '2016-03-16',
    count: 22,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 8,
        durationMinutes: 198.3,
        errorMessage:
          'Tableau Data Engine SQL error: Radiant Orders query timed out during tempdb sort.',
      },
    },
  },
  {
    date: '2016-03-17',
    count: 20,
    overrides: {
      'provider-productivity': {
        delayMinutes: 25,
        durationMinutes: 72.6,
      },
    },
  },
  {
    date: '2016-03-18',
    count: 21,
    overrides: {
      'claim-aging': {
        status: 'Failed',
        delayMinutes: 12,
        durationMinutes: 70.4,
        errorMessage:
          'ODBC SQL error: claim aging extract could not complete before remittance staging closed.',
      },
    },
  },
  { date: '2016-03-19', count: 20, overrides: {} },
  {
    date: '2016-03-20',
    count: 22,
    overrides: {
      'radiant-orders': {
        status: 'Failed',
        delayMinutes: 385,
        durationMinutes: 414.93,
        errorMessage:
          'Tableau Data Engine SQL error: [EpicCaboodle].[RadiantOrders] query timed out while waiting for tempdb sort workspace.',
      },
      'claim-aging': {
        status: 'Failed',
        delayMinutes: 11,
        durationMinutes: 65.8,
        errorMessage:
          'ODBC SQL error: claim aging extract could not complete before payer remittance staging closed.',
      },
    },
  },
];

const historyDates = [
  '2016-02-22',
  '2016-02-24',
  '2016-02-25',
  '2016-02-26',
  '2016-02-29',
  '2016-03-01',
  '2016-03-02',
  '2016-03-03',
  '2016-03-04',
  '2016-03-07',
  '2016-03-08',
  '2016-03-09',
  '2016-03-10',
  '2016-03-11',
  '2016-03-12',
  '2016-03-13',
  '2016-03-14',
  '2016-03-15',
  '2016-03-16',
  '2016-03-17',
  '2016-03-18',
  '2016-03-20',
];

const historySpecs: HistorySpec[] = [
  {
    processName: 'Epic Radiant Orders',
    slug: 'radiant-orders',
    averageDurationMinutes: 124.93,
    startTime: '10:34',
    failedDates: [
      '2016-02-24',
      '2016-03-01',
      '2016-03-04',
      '2016-03-09',
      '2016-03-12',
      '2016-03-16',
      '2016-03-20',
    ],
    durationOverrides: {
      '2016-02-24': 188.4,
      '2016-03-01': 202.1,
      '2016-03-04': 194.6,
      '2016-03-09': 210.8,
      '2016-03-12': 226.9,
      '2016-03-16': 198.3,
      '2016-03-20': 414.93,
    },
    startOverrides: { '2016-03-20': '16:55' },
  },
  {
    processName: 'Epic ASAP Events',
    slug: 'asap-events',
    averageDurationMinutes: 45.2,
    startTime: '11:04',
    failedDates: ['2016-03-13', '2016-03-15'],
    durationOverrides: { '2016-03-13': 118.6, '2016-03-15': 99.2 },
  },
  {
    processName: 'Epic Medication Charges',
    slug: 'medication-charges',
    averageDurationMinutes: 41.5,
    startTime: '12:05',
    failedDates: ['2016-03-11', '2016-03-13'],
    durationOverrides: { '2016-03-11': 91.3, '2016-03-13': 84.1 },
  },
  {
    processName: 'Revenue Cycle Claim Aging',
    slug: 'claim-aging',
    averageDurationMinutes: 38.0,
    startTime: '13:36',
    failedDates: ['2016-03-08', '2016-03-18', '2016-03-20'],
    durationOverrides: { '2016-03-08': 74.2, '2016-03-18': 70.4, '2016-03-20': 65.8 },
    startOverrides: { '2016-03-20': '13:41' },
  },
  {
    processName: 'Epic MyChart Status',
    slug: 'mychart-status',
    averageDurationMinutes: 18.8,
    startTime: '09:02',
    failedDates: [],
  },
  {
    processName: 'Epic Bed Board Census',
    slug: 'bed-board',
    averageDurationMinutes: 15.9,
    startTime: '07:03',
    failedDates: [],
  },
  {
    processName: 'Lab Result Turnaround',
    slug: 'lab-turnaround',
    averageDurationMinutes: 20.4,
    startTime: '10:02',
    failedDates: ['2016-03-13'],
    durationOverrides: { '2016-03-13': 69.5 },
  },
];

function addMinutes(date: string, time: string, minutes: number): string {
  const [hourPart, minutePart] = time.split(':');
  const totalMinutes = Number(hourPart) * 60 + Number(minutePart) + minutes;
  const dayOffset = Math.floor(totalMinutes / 1440);
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  const timestampDate = new Date(`${date}T00:00:00Z`);
  timestampDate.setUTCDate(timestampDate.getUTCDate() + dayOffset);
  const datePart = timestampDate.toISOString().slice(0, 10);
  return `${datePart}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

function labelForDate(date: string): string {
  const [, , day] = date.split('-');
  return `Mar ${Number(day)}`;
}

function roundedFailureRate(failedTasks: number, totalTasks: number): number {
  return Number(((failedTasks / totalTasks) * 100).toFixed(1));
}

function buildRun(day: DaySpec, template: ProcessTemplate, index: number): ProcessRun {
  const override = day.overrides[template.slug];
  const status = override?.status ?? 'Succeeded';
  const daySeed = Number(day.date.slice(-2));
  const baseDelay = (daySeed + index * 3) % 8;
  const delayMinutes = override?.delayMinutes ?? baseDelay;
  const durationVariance = ((daySeed + index) % 5) - 2;
  const defaultDuration = Number(
    Math.max(5, template.averageDurationMinutes + durationVariance * 2.4).toFixed(1),
  );
  const durationMinutes = override?.durationMinutes ?? defaultDuration;

  return {
    id: `run-${day.date.replaceAll('-', '')}-${template.slug}`,
    processName: template.processName,
    type: template.type,
    date: day.date,
    status,
    scheduledStart: addMinutes(day.date, template.scheduledTime, 0),
    actualStart: addMinutes(day.date, template.scheduledTime, delayMinutes),
    durationMinutes,
    averageDurationMinutes: template.averageDurationMinutes,
    ...(override?.errorMessage ? { errorMessage: override.errorMessage } : {}),
  };
}

function buildProcessRuns(): ProcessRun[] {
  return daySpecs.flatMap((day) =>
    processCatalog.slice(0, day.count).map((template, index) => buildRun(day, template, index)),
  );
}

function buildDailySummaries(runs: ProcessRun[]): DailyFailureSummary[] {
  return daySpecs.map((day) => {
    const dayRuns = runs.filter((run) => run.date === day.date);
    const failedTasks = dayRuns.filter((run) => run.status === 'Failed').length;
    return {
      date: day.date,
      label: labelForDate(day.date),
      failureRate: roundedFailureRate(failedTasks, dayRuns.length),
      failedTasks,
      totalTasks: dayRuns.length,
    };
  });
}

function buildHistory(spec: HistorySpec): ProcessHistoryRun[] {
  return historyDates.map((date, index) => {
    const failed = spec.failedDates.includes(date);
    const durationVariance = ((index % 5) - 2) * 1.7;
    const durationMinutes =
      spec.durationOverrides?.[date] ??
      Number(Math.max(5, spec.averageDurationMinutes + durationVariance).toFixed(1));
    const actualStart = spec.startOverrides?.[date]
      ? addMinutes(date, spec.startOverrides[date], 0)
      : addMinutes(date, spec.startTime, index % 4);

    return {
      id: `history-${spec.slug}-${date.replaceAll('-', '')}`,
      processName: spec.processName,
      date,
      status: failed ? 'Failed' : 'Succeeded',
      actualStart,
      durationMinutes,
      averageDurationMinutes: spec.averageDurationMinutes,
    };
  });
}

export const processRuns: ProcessRun[] = buildProcessRuns();

export const dailySummaries: DailyFailureSummary[] = buildDailySummaries(processRuns);

export const processHistory: ProcessHistoryRun[] = historySpecs.flatMap(buildHistory);
