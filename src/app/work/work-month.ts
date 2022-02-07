import * as moment from 'moment';

export interface WorkMonth {
  datefrom: moment.Moment;
  dateuntil: moment.Moment;
  days: number;
  holidays: number;
  id: number;
  month: number;
  timeclose: number;
  timedif: number;
  timestart: number;
  updated: moment.Moment;
  userid: number;
  weekenddays: number;
  year: number;
}
