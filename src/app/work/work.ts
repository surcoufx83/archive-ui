import { ParsedEventType } from "@angular/compiler";
import { Party } from "../common";

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

export interface WorkLead {
  id: number;
  completed: boolean;
  date_accepted: null|string;
  date_completed: null|string;
  date_reported: string;
  cpo: WorkLeadCpo;
  customer: null|WorkCustomer;
  customerid: null|number;
  customer_name: string;
  incentive: WorkLeadIncentive;
  lead: WorkLeadLead;
  paid: boolean;
  party: null|Party;
  partyid: null|number;
  products: string;
  project_name: string;
  project_description: string;
  sales: string;
  userid: number;
}

export interface WorkLeadCpo {
  cpo_projectno: string;
  cpo_projectname: string;
}

export interface WorkLeadIncentive {
  isincentive: boolean;
  incentive_completed: boolean;
  incentive_gross_value: number;
  incentive_net_value: number;
  incentive_paid: null|string;
  incentive_splitfactor: number;
  incentive_value: number;
}

export interface WorkLeadLead {
  islead: boolean;
  lead_no: string;
  lead_text: string;
  opp_no: string;
  state: string;
  contract_value: number;
  lead_gross_value: number;
  lead_net_value: number;
  lead_paid: null|string;
  lead_completed: boolean;
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
  quickselect: boolean;
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

export interface WorkProperties {
  customers: WorkCustomer[];
  leads: WorkLead[];
  offCategories: WorkOffCategory[];
  projects: WorkProject[];
  timeCategories: WorkTimeCategory[];
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
