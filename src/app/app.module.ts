import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxFilesizeModule } from 'ngx-filesize';

import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth.service';
import { CasesComponent } from './cases/cases.component';
import { ConfigService } from './config.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FinanceComponent } from './finance/finance.component';
import { I18nService } from './i18n.service';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotepadComponent } from './notepad/notepad.component';
import { UiBusyIndicatorComponent } from './utils/ui-busy-indicator/ui-busy-indicator.component';
import { UiCenteredBusyIndicatorComponent } from './utils/ui-centered-busy-indicator/ui-centered-busy-indicator.component';
import { WorkCalendarComponent } from './work/settings/calendar/calendar.component';
import { WorkCustomerComponent } from './work/settings/customers/customer/customer.component';
import { WorkCustomersComponent } from './work/settings/customers/customers.component';
import { WorkComponent } from './work/work.component';
import { WorkDayComponent } from './work/work-day/work-day.component';
import { WorkHolidaysComponent } from './work/settings/calendar/holidays/holidays.component';
import { WorkLeadComponent } from './work/leads/lead/lead.component';
import { WorkLeadsComponent } from './work/leads/leads.component';
import { WorkMonthComponent } from './work/work-month/work-month.component';
import { WorkOffCategoriesComponent } from './work/settings/off-categories/off-categories.component';
import { WorkProjectsComponent } from './work/settings/customers/projects/projects.component';
import { WorkTimeCategoriesComponent } from './work/settings/time-categories/time-categories.component';
import { WorkYearComponent } from './work/work-year/work-year.component';
import { Oauth2CallbackComponent } from './login/oauth2-callback/oauth2-callback.component';
import { SearchComponent } from './search/search.component';
import { FileComponent } from './files/file/file.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AccountComponent,
    AppComponent,
    CasesComponent,
    DashboardComponent,
    FinanceComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    NotepadComponent,
    UiBusyIndicatorComponent,
    UiCenteredBusyIndicatorComponent,
    WorkCalendarComponent,
    WorkComponent,
    WorkCustomerComponent,
    WorkCustomersComponent,
    WorkDayComponent,
    WorkHolidaysComponent,
    WorkLeadComponent,
    WorkLeadsComponent,
    WorkMonthComponent,
    WorkOffCategoriesComponent,
    WorkProjectsComponent,
    WorkTimeCategoriesComponent,
    WorkYearComponent,
    Oauth2CallbackComponent,
    SearchComponent,
    FileComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxFilesizeModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [ConfigService],
      multi: true,
      useFactory: (configService: ConfigService) => () => configService.loadAppConfig()
    },
    {
      provide: APP_INITIALIZER,
      deps: [I18nService],
      multi: true,
      useFactory: (i18nService: I18nService) => () => i18nService.loadLocalStrings(navigator.language.substr(0, 2))
    },
    {
      provide: APP_INITIALIZER,
      deps: [AuthService],
      multi: true,
      useFactory: (authService: AuthService) => () => {}
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
