import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { EventColor } from 'calendar-utils/calendar-utils';
import { add, differenceInMinutes, format, getDate, getMonth, getYear, isAfter, isBefore, isSameDay, isSameMonth, parseISO, sub } from 'date-fns';
import { BehaviorSubject, Subject, Subscription, first } from 'rxjs';
import { ApiReply, UserSettings, WorkDay, WorkDayBooking, WorkMonth, WorkOffCategory } from 'src/app/if';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../../auth.service';
import { I18nService } from '../../i18n.service';
import { SettingsService } from '../../utils/settings.service';

@Component({
  selector: 'app-work-month',
  templateUrl: './work-month.component.html',
  styleUrls: ['./work-month.component.scss']
})
export class WorkMonthComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('calendar', { static: true }) calendar?: TemplateRef<any>;

  activeDayIsOpen: boolean = false;
  calendarEvents: CalendarEvent[] = [];
  dayObjs: { [key: number]: WorkDay } = {};
  icons = environment.icons;
  month: number | undefined;
  monthLoading: boolean = true;
  monthObj?: WorkMonth;
  offdayDroppableEvents: CalendarEvent[] = [];
  private selectedDate$: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  refresh = new Subject<void>();
  selectedDate = this.selectedDate$.asObservable();
  selectedDay?: WorkDay;
  selectedMonth: Date = new Date();
  subscriptions: Subscription[] = [];
  today: Date = new Date();
  usersettingsObj: UserSettings | null = null;
  viewDate: Date = new Date();
  year: number | undefined;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private router: Router,
    private userSettings: SettingsService,
  ) { }

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
      this.selectedDate$.next(date);
    }
  }

  eventTimesChanged({ event, newStart, newEnd, }: CalendarEventTimesChangedEvent): void {
    if (event.meta.type == undefined)
      return;
    if (event.meta.type === 'WorkOffCategory') {
      let cat: WorkOffCategory = event.meta.obj;
      let date: number = getDate(newStart);
      if (this.dayObjs[date] == undefined || !isSameMonth(newStart, new Date((<WorkMonth>this.monthObj).datefrom)))
        return;
      let day = this.dayObjs[date];
      let url = `${environment.api.baseUrl}/work/day/${this.monthObj?.id}/${day.id}/offdays/set/${cat.id}`;
      this.authService.updateApi(url, {}).pipe(first()).subscribe((reply: ApiReply) => {
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

  handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Clicked') {
      if (event.meta.booking != null)
        navigator.clipboard.writeText(this.getProjectDescription(event.meta.booking));
    }
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngAfterViewInit() {
    this.subscriptions.push(this.route.paramMap.subscribe((params: ParamMap) => {
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
    }));
  }

  ngAfterViewInitLoadFromBackend(): void {
    let url = `${environment.api.baseUrl}/work/month/` + format(this.selectedMonth, 'yyyy-M');
    this.authService.queryApi(url).pipe(first()).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        if (reply.payload['month'] != null) {
          this.monthObj = <WorkMonth>reply.payload['month'];
          this.i18nService.setTitle('workmonth.pagetitle', [this.f(this.selectedMonth, 'MMMM yyyy')]);
          if (reply.payload['days'] != null) {
            this.dayObjs = <{ [key: number]: WorkDay }>reply.payload['days'];
            this.calendarEvents = [];
            for (const key in this.dayObjs) {
              let day: WorkDay = this.dayObjs[key];
              if (day.bookings != null) {
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
            const today = new Date();
            if (this.monthObj.month == getMonth(today) + 1 && this.dayObjs[getDate(today)] != undefined)
              this.selectedDate$.next(today);
            else if (this.dayObjs[1] != undefined) {
              this.selectedDate$.next(this.s2d(this.dayObjs[1].date));
            }
          }
        }
      }
      this.monthLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.subscriptions.push(this.userSettings.workOfftimeCategories$.subscribe((categories) => {
      this.offdayDroppableEvents = [];
      for (const offcat of Object.values(categories)) {
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
    }));
    this.subscriptions.push(this.selectedDate.subscribe((date) => {
      if (date == null)
        return;
      this.viewDate = date;
      Object.keys(this.dayObjs).forEach((daynum: string) => {
        if (isSameDay(parseISO(this.dayObjs[+daynum].date), date)) {
          this.selectedDay = this.dayObjs[+daynum];
          this.activeDayIsOpen = this.selectedDay.bookings != null || this.selectedDay.offcategory != null;
          if (this.selectedDay.bookings != null) {
            let starttime: string = '';
            let endtime: string = '';
            let durmin: number = 0;
            for (const key in this.selectedDay.bookings) {
              const booking = this.selectedDay.bookings[key];
              if (starttime == '' || isBefore(this.s2d(booking.timefrom), this.s2d(starttime)))
                starttime = booking.timefrom;
              if (endtime == '' || isAfter(this.s2d(booking.timeuntil), this.s2d(endtime)))
                endtime = booking.timeuntil;
              durmin += differenceInMinutes(this.s2d(booking.timeuntil), this.s2d(booking.timefrom)) - (booking.break * 60);
            }
            if (starttime != '' && endtime != '' && isBefore(this.s2d(starttime), this.s2d(endtime))) {
              const dayduration = differenceInMinutes(this.s2d(endtime), this.s2d(starttime));
              this.selectedDay.daytimeStats = {
                startOfDay: starttime,
                endOfDay: endtime,
                totalDurationWithoutBreaks: dayduration / 60,
                totalDurationWithBreaks: durmin / 60,
                breaksDuration: (dayduration - durmin) / 60
              };
            }
          }
          else
            this.selectedDay.daytimeStats = undefined;
        }
      });
    }));
  }

  pushUserSettings(): void {
    this.userSettings.updateSettings(<UserSettings>this.usersettingsObj, true);
  }

  s2d(datestr: string): Date {
    return new Date(datestr);
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