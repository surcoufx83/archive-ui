
export interface Settings {
  view: ViewSettings;
  work: WorkSettings;
}

export interface ViewSettings {
  calendar: CalendarViewSettings;
  lists: ListViewSettings;
}

export interface CalendarViewSettings {
  asList: boolean;
  firstDayOfWeek: number;
  showWeek: boolean;
  showWeekend: boolean;
}

export interface ListViewSettings {
  length: number;
}

export interface WorkSettings {
  leads: WorkLeadsSettings;
  livetracking: LiveTrackingSettings;
  tracking: TrackingSettings;
  worktime: WorkTimeSettings;
}

export interface WorkLeadsSettings {
  enabled: boolean;
}

export interface WorkTimeSettings {
  default: number;
  holidays: number;
  other: number;
  weekend: number;
}

export interface LiveTrackingSettings {
  enabled: boolean;
  rounding: number;
  roundmode: any|null;
}

export interface TrackingSettings {
  trackCustomer: boolean;
  trackCustomerProject: boolean;
  trackProjectTask: boolean;
  projectNameInDescription: boolean;
}
