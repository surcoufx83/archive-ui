import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './account/account.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CasesComponent } from './cases/cases.component';
import { ConfigService } from './config.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FinanceComponent } from './finance/finance.component';
import { I18nService } from './i18n.service';
import { LoginCheckComponent } from './login-check/login-check.component';
import { LoginComponent } from './login/login.component';
import { WorkCalendarComponent } from './work/settings/calendar/calendar.component';
import { LogoutComponent } from './logout/logout.component';
import { NotepadComponent } from './notepad/notepad.component';
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
import { WorkSettingsComponent } from './work/settings/settings.component';
import { WorkTimeCategoriesComponent } from './work/settings/time-categories/time-categories.component';
import { WorkYearComponent } from './work/work-year/work-year.component';

@NgModule({
  declarations: [
    AccountComponent,
    AppComponent,
    CasesComponent,
    DashboardComponent,
    FinanceComponent,
    HomeComponent,
    LoginCheckComponent,
    LoginComponent,
    LogoutComponent,
    NotepadComponent,
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
    WorkSettingsComponent,
    WorkTimeCategoriesComponent,
    WorkYearComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
