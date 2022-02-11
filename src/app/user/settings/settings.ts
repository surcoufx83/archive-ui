
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
  showWeek: boolean;
  sundayFirst: boolean;
}

export interface ListViewSettings {
  length: number;
}

export interface WorkSettings {
  worktime: WorkTimeSettings;
}

export interface WorkTimeSettings {
  default: number;
  holidays: number;
  other: number;
  weekend: number;
  livetracking: LiveTrackingSettings;
  tracking: TrackingSettings;
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
