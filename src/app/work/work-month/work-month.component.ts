import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { add, format, getMonth, getYear, isSameDay, isSameMonth, sub } from 'date-fns';

import { AuthService } from '../../auth.service';
import { ConfigService, AppConfig } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { WorkMonth, WorkDay, WorkDayBooking } from '../work';
import { SettingsService } from '../../user/settings/settings.service';
import { Settings } from '../../user/settings/settings';

@Component({
  selector: 'app-work-month',
  templateUrl: './work-month.component.html',
  styleUrls: ['./work-month.component.scss']
})
export class WorkMonthComponent implements OnInit, AfterViewInit {

  @ViewChild('calendar', { static: true }) calendar?: TemplateRef<any>;

  calendarEvents: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  refresh = new Subject<void>();

  today: Date = new Date();
  selectedMonth: Date = new Date();
  viewDate: Date = new Date();
  year: number|undefined;
  month: number|undefined;
  monthLoading: boolean = false;
  dayObjs: WorkDay[] = [];
  monthObj?: WorkMonth;
  usersettingsObj?: Settings;

  constructor(private authService: AuthService,
              private configService: ConfigService,
              private i18nService: I18nService,
              private route: ActivatedRoute,
              private router: Router,
              private userSettings: SettingsService)
  {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []) : string {
    return this.i18nService.i18n(key, params);
  }

  get locale() : string {
    return this.i18nService.Locale;
  }

  get IsToday() : boolean {
    return isSameMonth(this.today, this.selectedMonth);
    // return this.today.isSame(this.selectedMonth, 'month');
    return false;
  }

  get LastMonth() : Date {
    return sub(this.selectedMonth, { months: 1 });
    //return moment(this.selectedMonth).subtract(1, 'months');
  }

  get NextMonth() : Date {
    return add(this.selectedMonth, { months: 1 });
    //return moment(this.selectedMonth).add(1, 'months');
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let y = params.get('year');
      if (y != null && +y >= 2022 && +y <= (getYear(this.selectedMonth) + 2))
        this.year = +y;
      else
        this.year = undefined;
      let m = params.get('month');
      if (m != null && +m >= 1 && +m <= 12)
        this.month = +m;
      else
        this.month = undefined;
      if (this.year == undefined && this.month == undefined)
        this.router.navigate(['work', 'month', getYear(this.selectedMonth), (getMonth(this.selectedMonth) + 1)]);
      else if (this.year == undefined && this.month != undefined)
        this.router.navigate(['work', 'month', getYear(this.selectedMonth), this.month]);
      else if (this.year != undefined && this.month == undefined)
        this.router.navigate(['work', 'month', this.year, (getMonth(this.selectedMonth) + 1)]);
      else {
        this.monthLoading = true;
        this.selectedMonth = new Date(<number>this.year, <number>this.month - 1, this.today.getDate());
        this.viewDate = this.selectedMonth;
        this.ngAfterViewInitLoadFromBackend();
      }
    });
  }

  ngAfterViewInitLoadFromBackend() : void {
    console.log('ngOnInitLoadFromBackend', format(this.selectedMonth, 'yyyy-MM-dd'));
    let url = this.config.api.baseUrl + '/work/month/' + format(this.selectedMonth, 'yyyy-M');
    this.authService.queryApi(url).subscribe((reply) => {
      console.log(reply);
      if (reply.success && reply.payload != undefined) {
        if (reply.payload['month'] != null) {
          this.monthObj = <WorkMonth>reply.payload['month'];
          if (reply.payload['days'] != null) {
            this.dayObjs = <WorkDay[]>reply.payload['days'];
            this.calendarEvents = [];
            for (const key in this.dayObjs) {
              let day: WorkDay = this.dayObjs[key];
              for (const id in day.bookings) {
                let e = day.bookings[id];
                this.calendarEvents.push({
                  id: 'event-' + e.id,
                  title: this.fd(e.duration) + ': ' + this.getProjectDescription(e, true) + ' (' + this.i18n('work.timecategories.' + e.timecategory.name) + ')',
                  start: new Date(e.timefrom),
                  end: new Date(e.timeuntil),
                  allDay: false,
                  color: e.timecategory.calendarcolor,
                  meta: {
                    booking: e
                  }
                });
              }
              if (day.holiday != null && day.offcategory != null) {
                this.calendarEvents.push({
                  id: 'holidayevent-' + day.id,
                  title: this.i18n('work.offcategories.' + day.offcategory.name) + ': ' + this.i18n('calendar.holidays.' + day.holiday.name),
                  start: new Date(day.date),
                  allDay: true,
                  color: day.offcategory.calendarcolor,
                  meta: {
                    holiday: day.holiday,
                    category: day.offcategory
                  }
                });
              } else if (day.offcategory != null) {
                this.calendarEvents.push({
                  id: 'holidayevent-' + day.id,
                  title: this.i18n('work.offcategories.' + day.offcategory.name),
                  start: new Date(day.date),
                  allDay: true,
                  color: day.offcategory.calendarcolor,
                  meta: {
                    category: day.offcategory
                  }
                });
              }
            }
          }
        }
      }
      console.log(this.monthObj);
      this.monthLoading = false;
    });
  }

  pushUserSettings() : void {
    this.userSettings.update(<Settings>this.usersettingsObj, true);
  }

  /*strToDateFormat(date: string, format: string) : string {
    let d = moment(date).locale(this.i18nService.Locale);
    return d.format(format);
  }*/

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('dayClicked', date, events);
    // this.selectedMonth = date;
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    console.log('eventTimesChanged', event, newStart, newEnd);
    /*
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);*/
  }

  f(date: Date, form: string) : string {
    return format(date, form);
  }

  fd(duration: number) : string {
    return this.i18n('calendar.duration.short', [ duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 }) ]);
  }

  getProjectDescription(entry: WorkDayBooking, inclCustomer: boolean = false) : string {
    return (entry.customer && inclCustomer ? entry.customer.name + ' // ' : '') 
         + (entry.project ? entry.project.name + ' // ' : '')
         + (entry.projectstage !== '' ? entry.projectstage + ' // ' : '')
         + entry.description;
    // e.customer?.name + ' // ' + e.project?.name + ' // ' + e.projectstage + ' // ' + e.description
  }

  s2d(datestr: string) : Date {
    return new Date(datestr);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('handleEvent', action, event);
    if (action === 'Clicked') {
      if (event.meta.booking != null)
        navigator.clipboard.writeText(this.getProjectDescription(event.meta.booking));
    }
    /*
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
    */
  }

  addEvent(): void {
    /*this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];*/
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    // this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    // this.view = view;
  }

  closeOpenMonthViewDay() {
    // this.activeDayIsOpen = false;
  }

}

export interface CalendarWeek {
  weekNo: number;
  days: CalendarDay[];
}

export interface CalendarDay {
  day: number;
  date: number;
  matchMonth: boolean;
}