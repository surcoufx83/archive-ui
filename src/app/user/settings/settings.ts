export interface Settings {
  viewSettings: ViewSettings;
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
