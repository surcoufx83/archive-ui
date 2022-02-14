
export interface WorkCalendarColor {
  primary: string;
  secondary: string;
}

export interface WorkCustomer {
  created: string;
  disabled: boolean;
  id: number;
  lastusage: string|null;
  name: string;
  userid: number;
}

export interface WorkDay {
  bookings: WorkDayBooking[];
  date: string;
  day: number;
  holiday: WorkHoliday|null;
  holidayid: number|null;
  id: number;
  month: WorkMonth;
  monthid: number;
  note: string;
  offcategory: WorkOffCategory|null;
  offcategoryid: number|null;
  stats: WorkDayStats|null;
}

export interface WorkDayBooking {
  break: number;
  customer: WorkCustomer|null;
  customerid: number|null;
  dayid: number;
  description: string;
  duration: number;
  id: number;
  project: WorkProject|null;
  projectid: number|null;
  projectstage: string;
  timecategory: WorkTimeCategory;
  timecategoryid: number;
  timefrom: string;
  timeuntil: string;
}

export interface WorkDayStats {
  avgduration: number;
  bookings: number;
  break: number;
  categories: number;
  categorylist: number[];
  customerlist: number[];
  customers: number;
  dayid: number;
  duration: number;
  maxduration: number;
  minduration: number;
  projectlist: number[];
  projects: number;
}

export interface WorkHoliday {
  daysAfterEaster: number|null;
  fixdate: string|null;
  fixmd: string|null;
  id: number;
  name: string;
  userid: number;
}

export interface WorkMonth {
  datefrom: string;
  dateuntil: string;
  days: number;
  holidays: number;
  id: number;
  month: number;
  timeclose: number;
  timedif: number;
  timestart: number;
  updated: string;
  userid: number;
  weekenddays: number;
  year: number;
}

export interface WorkOffCategory {
  calendarcolor: WorkCalendarColor;
  icon: string;
  iconcolor: string;
  id: number;
  name: string;
  rowcolor: string;
  userid: number;
}

export interface WorkProject {
  created: string;
  customer: WorkCustomer;
  customerid: number;
  disabled: boolean;
  id: number;
  lastusage: string|null;
  name: string;
  userid: number;
}

export interface WorkTimeCategory {
  calendarcolor: WorkCalendarColor;
  icon: string;
  iconcolor: string;
  id: number;
  name: string;
  rowcolor: string;
  userid: number;
}
