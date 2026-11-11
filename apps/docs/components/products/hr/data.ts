// Sample data for the HR demo. The company and the people are made up; amounts are monthly, in TRY.

export type Department = 'engineering' | 'sales' | 'marketing' | 'finance' | 'operations' | 'people';
export type EmployeeStatus = 'active' | 'onLeave' | 'probation';

export type Employee = {
  id: string;
  name: string;
  title: { en: string; tr: string };
  department: Department;
  location: 'istanbul' | 'ankara' | 'izmir' | 'remote';
  start: string;
  gross: number;
  leaveLeft: number;
  status: EmployeeStatus;
  manager?: string;
  birthday: string;
};

export const COMPANY = 'Kuzey Teknoloji';

export const EMPLOYEES: Employee[] = [
  {
    id: 'e01',
    name: 'Elif Aydın',
    title: { en: 'CEO', tr: 'Genel Müdür' },
    department: 'operations',
    location: 'istanbul',
    start: '2019-02-04',
    gross: 245000,
    leaveLeft: 12,
    status: 'active',
    birthday: '11-19',
  },
  {
    id: 'e02',
    name: 'Mert Kaya',
    title: { en: 'Engineering Manager', tr: 'Mühendislik Müdürü' },
    department: 'engineering',
    location: 'istanbul',
    start: '2020-06-15',
    gross: 168000,
    leaveLeft: 9,
    status: 'active',
    manager: 'e01',
    birthday: '03-02',
  },
  {
    id: 'e03',
    name: 'Zeynep Demir',
    title: {
      en: 'Senior Frontend Engineer',
      tr: 'Kıdemli Frontend Geliştirici',
    },
    department: 'engineering',
    location: 'remote',
    start: '2021-01-11',
    gross: 132000,
    leaveLeft: 14,
    status: 'active',
    manager: 'e02',
    birthday: '11-14',
  },
  {
    id: 'e04',
    name: 'Burak Şahin',
    title: { en: 'Backend Engineer', tr: 'Backend Geliştirici' },
    department: 'engineering',
    location: 'ankara',
    start: '2022-09-01',
    gross: 104000,
    leaveLeft: 6,
    status: 'onLeave',
    manager: 'e02',
    birthday: '07-21',
  },
  {
    id: 'e05',
    name: 'Ayşe Yıldız',
    title: { en: 'Product Designer', tr: 'Ürün Tasarımcısı' },
    department: 'engineering',
    location: 'istanbul',
    start: '2023-03-20',
    gross: 98000,
    leaveLeft: 11,
    status: 'active',
    manager: 'e02',
    birthday: '01-30',
  },
  {
    id: 'e06',
    name: 'Can Öztürk',
    title: { en: 'QA Engineer', tr: 'Test Mühendisi' },
    department: 'engineering',
    location: 'izmir',
    start: '2026-09-07',
    gross: 72000,
    leaveLeft: 4,
    status: 'probation',
    manager: 'e02',
    birthday: '05-09',
  },
  {
    id: 'e07',
    name: 'Selin Arslan',
    title: { en: 'Sales Director', tr: 'Satış Direktörü' },
    department: 'sales',
    location: 'istanbul',
    start: '2020-01-06',
    gross: 155000,
    leaveLeft: 8,
    status: 'active',
    manager: 'e01',
    birthday: '11-22',
  },
  {
    id: 'e08',
    name: 'Emre Çelik',
    title: { en: 'Account Executive', tr: 'Satış Temsilcisi' },
    department: 'sales',
    location: 'ankara',
    start: '2022-04-18',
    gross: 78000,
    leaveLeft: 10,
    status: 'active',
    manager: 'e07',
    birthday: '09-12',
  },
  {
    id: 'e09',
    name: 'Deniz Koç',
    title: { en: 'Account Executive', tr: 'Satış Temsilcisi' },
    department: 'sales',
    location: 'izmir',
    start: '2024-02-12',
    gross: 74000,
    leaveLeft: 13,
    status: 'active',
    manager: 'e07',
    birthday: '12-03',
  },
  {
    id: 'e10',
    name: 'Gizem Kurt',
    title: { en: 'Marketing Manager', tr: 'Pazarlama Müdürü' },
    department: 'marketing',
    location: 'istanbul',
    start: '2021-08-02',
    gross: 118000,
    leaveLeft: 7,
    status: 'active',
    manager: 'e01',
    birthday: '04-17',
  },
  {
    id: 'e11',
    name: 'Oğuz Aksoy',
    title: { en: 'Content Specialist', tr: 'İçerik Uzmanı' },
    department: 'marketing',
    location: 'remote',
    start: '2025-05-05',
    gross: 66000,
    leaveLeft: 14,
    status: 'active',
    manager: 'e10',
    birthday: '08-28',
  },
  {
    id: 'e12',
    name: 'Ece Polat',
    title: { en: 'Finance Manager', tr: 'Finans Müdürü' },
    department: 'finance',
    location: 'istanbul',
    start: '2020-11-23',
    gross: 128000,
    leaveLeft: 5,
    status: 'active',
    manager: 'e01',
    birthday: '06-06',
  },
  {
    id: 'e13',
    name: 'Kaan Erdem',
    title: { en: 'Accountant', tr: 'Muhasebe Uzmanı' },
    department: 'finance',
    location: 'istanbul',
    start: '2023-10-09',
    gross: 70000,
    leaveLeft: 12,
    status: 'onLeave',
    manager: 'e12',
    birthday: '02-14',
  },
  {
    id: 'e14',
    name: 'Nazlı Güneş',
    title: { en: 'HR Manager', tr: 'İK Müdürü' },
    department: 'people',
    location: 'istanbul',
    start: '2021-03-01',
    gross: 112000,
    leaveLeft: 10,
    status: 'active',
    manager: 'e01',
    birthday: '10-25',
  },
  {
    id: 'e15',
    name: 'Tolga Bulut',
    title: { en: 'Recruiter', tr: 'İşe Alım Uzmanı' },
    department: 'people',
    location: 'ankara',
    start: '2026-10-13',
    gross: 62000,
    leaveLeft: 2,
    status: 'probation',
    manager: 'e14',
    birthday: '11-27',
  },
  {
    id: 'e16',
    name: 'Merve Doğan',
    title: { en: 'Office Manager', tr: 'Ofis Yöneticisi' },
    department: 'operations',
    location: 'istanbul',
    start: '2022-01-17',
    gross: 58000,
    leaveLeft: 9,
    status: 'active',
    manager: 'e01',
    birthday: '03-29',
  },
];

export const employee = (id: string) => EMPLOYEES.find((e) => e.id === id)!;

export type LeaveType = 'annual' | 'sick' | 'unpaid' | 'excuse';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  employee: string;
  type: LeaveType;
  start: string;
  end: string;
  days: number;
  status: LeaveStatus;
  requested: string;
};

export const LEAVES: LeaveRequest[] = [
  {
    id: 'l01',
    employee: 'e03',
    type: 'annual',
    start: '2026-11-24',
    end: '2026-11-28',
    days: 5,
    status: 'pending',
    requested: '2026-11-09',
  },
  {
    id: 'l02',
    employee: 'e08',
    type: 'excuse',
    start: '2026-11-14',
    end: '2026-11-14',
    days: 1,
    status: 'pending',
    requested: '2026-11-10',
  },
  {
    id: 'l03',
    employee: 'e11',
    type: 'annual',
    start: '2026-12-22',
    end: '2027-01-02',
    days: 9,
    status: 'pending',
    requested: '2026-11-10',
  },
  {
    id: 'l04',
    employee: 'e05',
    type: 'sick',
    start: '2026-11-12',
    end: '2026-11-13',
    days: 2,
    status: 'pending',
    requested: '2026-11-11',
  },
  {
    id: 'l05',
    employee: 'e04',
    type: 'annual',
    start: '2026-11-03',
    end: '2026-11-17',
    days: 11,
    status: 'approved',
    requested: '2026-10-15',
  },
  {
    id: 'l06',
    employee: 'e13',
    type: 'unpaid',
    start: '2026-11-10',
    end: '2026-11-21',
    days: 10,
    status: 'approved',
    requested: '2026-10-27',
  },
  {
    id: 'l07',
    employee: 'e09',
    type: 'annual',
    start: '2026-10-20',
    end: '2026-10-24',
    days: 5,
    status: 'approved',
    requested: '2026-10-01',
  },
  {
    id: 'l08',
    employee: 'e16',
    type: 'excuse',
    start: '2026-10-31',
    end: '2026-10-31',
    days: 1,
    status: 'rejected',
    requested: '2026-10-29',
  },
];

/** Shift codes of the week view; times are local. */
export type Shift = 'day' | 'early' | 'late' | 'remote' | 'leave' | 'off';
export const SHIFT_HOURS: Record<Shift, string> = {
  day: '09:00–18:00',
  early: '07:00–16:00',
  late: '13:00–22:00',
  remote: '09:00–18:00',
  leave: '',
  off: '',
};

export const WEEK = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'];

/** A week of shifts per employee, Monday to Sunday. */
export function weekShifts(e: Employee): Shift[] {
  if (e.status === 'onLeave') return ['leave', 'leave', 'leave', 'leave', 'leave', 'off', 'off'];
  if (e.location === 'remote') return ['remote', 'remote', 'remote', 'remote', 'remote', 'off', 'off'];
  if (e.department === 'operations' && e.id === 'e16') return ['early', 'early', 'early', 'early', 'early', 'early', 'off'];
  if (e.department === 'sales') return ['day', 'day', 'late', 'late', 'day', 'off', 'off'];
  const n = Number(e.id.slice(1));
  return ['day', n % 3 === 0 ? 'remote' : 'day', 'day', n % 2 === 0 ? 'remote' : 'day', 'day', 'off', 'off'];
}

/** Today's check-ins for the attendance list (hh:mm or null when not in yet). */
export function checkIn(e: Employee): string | null {
  const shifts = weekShifts(e);
  const today = shifts[2];
  if (today === 'leave' || today === 'off') return null;
  const n = Number(e.id.slice(1));
  if (n === 9) return null;
  const base = today === 'early' ? 7 * 60 : today === 'late' ? 13 * 60 : 9 * 60;
  const minutes = base - 12 + ((n * 7) % 31);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

// Payroll: a simplified Turkish calculation for the demo, not for real payroll. Employee SGK 14%,
// unemployment 1%, income tax 15% / 20% / 27% on the taxable amount, stamp tax 0.759%; the
// employer pays SGK 15.75% and unemployment 2% on top.
export type Payslip = {
  gross: number;
  sgk: number;
  unemployment: number;
  incomeTax: number;
  stampTax: number;
  net: number;
  employerSgk: number;
  employerUnemployment: number;
  cost: number;
};

const round = (n: number) => Math.round(n * 100) / 100;

export function payslip(gross: number): Payslip {
  const sgk = round(gross * 0.14);
  const unemployment = round(gross * 0.01);
  const taxable = gross - sgk - unemployment;
  const rate = taxable > 150000 ? 0.27 : taxable > 70000 ? 0.2 : 0.15;
  const incomeTax = round(taxable * rate);
  const stampTax = round(gross * 0.00759);
  const net = round(gross - sgk - unemployment - incomeTax - stampTax);
  const employerSgk = round(gross * 0.1575);
  const employerUnemployment = round(gross * 0.02);
  return {
    gross,
    sgk,
    unemployment,
    incomeTax,
    stampTax,
    net,
    employerSgk,
    employerUnemployment,
    cost: round(gross + employerSgk + employerUnemployment),
  };
}

export type PayrollMonth = {
  value: string;
  status: 'draft' | 'approved' | 'paid';
  raise: number;
};

/** Months of the payroll screen, newest first. October and September are paid; November is a draft. */
export const PAYROLL_MONTHS: PayrollMonth[] = [
  { value: '2026-11', status: 'draft', raise: 1 },
  { value: '2026-10', status: 'paid', raise: 1 },
  { value: '2026-09', status: 'paid', raise: 0.97 },
  { value: '2026-08', status: 'paid', raise: 0.97 },
];

/** Employees paid in a month: people who started later are left out. */
export const payrollEmployees = (month: string) => EMPLOYEES.filter((e) => e.start.slice(0, 7) <= month);

export const money = (lang: 'en' | 'tr', n: number, digits = 2) =>
  new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

export const date = (
  lang: 'en' | 'tr',
  iso: string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
) =>
  new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    timeZone: 'UTC',
    ...options,
  }).format(new Date(`${iso}T00:00:00Z`));

export const monthName = (lang: 'en' | 'tr', month: string) => date(lang, `${month}-01`, { month: 'long', year: 'numeric' });
