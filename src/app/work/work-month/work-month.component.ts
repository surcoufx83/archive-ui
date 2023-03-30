import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { add, format, getDate, getMonth, getYear, isSameDay, isSameMonth, sub } from 'date-fns';
import { Subject } from 'rxjs';

import { ApiReply, UserSettings, WorkDay, WorkDayBooking, WorkMonth, WorkOffCategory, WorkProperties } from 'src/app/if';
import { EventColor } from '../../../../node_modules/calendar-utils/calendar-utils';
import { AuthService } from '../../auth.service';
import { AppConfig, ConfigService } from '../../config.service';
import { I18nService } from '../../i18n.service';
import { SettingsService } from '../../user/settings/settings.service';

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
  year: number | undefined;
  month: number | undefined;
  monthLoading: boolean = true;
  dayObjs: WorkDay[] = [];
  monthObj?: WorkMonth;
  usersettingsObj: UserSettings | null = null;
  workprops: WorkProperties | null = null;

  offdayDroppableEvents: CalendarEvent[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService) {
    this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings);
    this.userSettings.workprops$.subscribe((props) => {
      if (props == null)
        return;
      this.workprops = props;
      this.offdayDroppableEvents = [];
      for (const offcat of props.offCategories) {
        this.offdayDroppableEvents.push({
          title: this.i18n('work.offcategories.' + offcat.name),
          start: new Date(),
          draggable: true,
          color: offcat.calendarcolor,
          allDay: true,
          meta: {
            obj: offcat,
            type: 'WorkOffCategory'
          }
        });
      }
      this.offdayDroppableEvents.push({
        title: this.i18n('work.offcategories.none'),
        start: new Date(),
        draggable: true,
        allDay: true,
        meta: {
          obj: {
            calendarcolor: {},
            icon: '',
            iconcolor: '',
            id: 0,
            name: this.i18n('work.offcategories.none'),
            quickselect: true,
            rowcolor: '',
            userid: 0
          },
          type: 'WorkOffCategory'
        }
      });
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get locale(): string {
    return this.i18nService.Locale;
  }

  get IsToday(): boolean {
    return isSameMonth(this.today, this.selectedMonth);
  }

  get LastMonth(): Date {
    return sub(this.selectedMonth, { months: 1 });
  }

  get NextMonth(): Date {
    return add(this.selectedMonth, { months: 1 });
  }

  ngOnInit(): void { }

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

  ngAfterViewInitLoadFromBackend(): void {
    let url = this.config.api.baseUrl + '/work/month/' + format(this.selectedMonth, 'yyyy-M');
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        if (reply.payload['month'] != null) {
          this.monthObj = <WorkMonth>reply.payload['month'];
          this.i18nService.setTitle('workmonth.pagetitle', [this.f(this.selectedMonth, 'MMMM yyyy')]);
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
                    booking: e,
                    incrementsBadgeTotal: true
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
                    category: day.offcategory,
                    incrementsBadgeTotal: false
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
                    category: day.offcategory,
                    incrementsBadgeTotal: false
                  }
                });
              }
            }
          }
        }
      }
      this.monthLoading = false;
    });
  }

  pushUserSettings(): void {
    this.userSettings.updateSettings(<UserSettings>this.usersettingsObj, true);
  }

  addEvent(id: string, title: string, start: Date, end: Date | undefined, allDay: boolean,
    color: EventColor | undefined, incrementBadgeCount: boolean,
    workObject: any, objectType: string): void {
    this.calendarEvents = [
      ...this.calendarEvents,
      {
        id: id,
        title: title,
        start: start,
        end: end,
        allDay: allDay,
        color: color,
        meta: {
          obj: workObject,
          type: objectType,
          incrementsBadgeTotal: incrementBadgeCount
        }
      }
    ];
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      day.badgeTotal = day.events.filter(
        (event) => event.meta.incrementsBadgeTotal
      ).length;
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
    if (event.meta.type == undefined)
      return;
    if (event.meta.type === 'WorkOffCategory') {
      let cat: WorkOffCategory = event.meta.obj;
      let date: number = getDate(newStart);
      if (this.dayObjs[date] == undefined || !isSameMonth(newStart, new Date((<WorkMonth>this.monthObj).datefrom)))
        return;
      let day = this.dayObjs[date];
      let url = this.config.api.baseUrl + `/work/day/${this.monthObj?.id}/${day.id}/offdays/set/${cat.id}`;
      this.authService.updateApi(url, {}).subscribe((reply: ApiReply) => {
        if (reply.success) {
          this.calendarEvents = [
            ...this.calendarEvents.filter((e) => {
              return !isSameDay(e.start, newStart);
            })
          ];
          if (cat.id !== 0)
            this.addEvent('' + Date.now(), event.title, newStart, undefined, true, cat.calendarcolor, false, cat, 'WorkOffCategory');
        }
      });
    }
  }

  f(date: Date, form: string): string {
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  fd(duration: number): string {
    return this.i18n('calendar.duration.short', [duration.toLocaleString(this.i18nService.Locale, { minimumFractionDigits: 1 })]);
  }

  getProjectDescription(entry: WorkDayBooking, inclCustomer: boolean = false): string {
    return (entry.customer && inclCustomer ? entry.customer.name + ' // ' : '')
      + (entry.project ? entry.project.name + ' // ' : '')
      + (entry.projectstage !== '' ? entry.projectstage + ' // ' : '')
      + entry.description;
  }

  s2d(datestr: string): Date {
    return new Date(datestr);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('handleEvent', action, event);
    if (action === 'Clicked') {
      if (event.meta.booking != null)
        navigator.clipboard.writeText(this.getProjectDescription(event.meta.booking));
    }
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