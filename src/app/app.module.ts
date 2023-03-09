import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxEchartsModule } from 'ngx-echarts';
import { MarkdownModule } from 'ngx-markdown';

import { NgChartsModule } from 'ng2-charts';
import { AccountComponent } from './account/account.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { CaseListItemComponent } from './cases/case-list-item/case-list-item.component';
import { CaseComponent } from './cases/case/case.component';
import { CasesComponent } from './cases/cases.component';
import { ConfigService } from './config.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DbClassesComponent } from './db/classes/classes.component';
import { DbCountriesComponent } from './db/countries/countries.component';
import { DbCurrenciesComponent } from './db/countries/currencies/currencies.component';
import { DbManagerComponent } from './db/manager/manager.component';
import { DbContactTypeComponent } from './db/parties/contacts/type/type.component';
import { DbPartyComponent } from './db/parties/party/party.component';
import { DbRoleComponent } from './db/parties/role/role.component';
import { FileListItemComponent } from './files/file-list-item/file-list-item.component';
import { FileComponent } from './files/file/file.component';
import { FilesComponent } from './files/files/files.component';
import { FolderBrowserDialogComponent } from './files/folder-browser-dialog/folder-browser-dialog.component';
import { AccountsComponent } from './finance/accounts/accounts.component';
import { FinanceComponent } from './finance/finance.component';
import { PriceComparisonComponent } from './finance/price-comparison/price-comparison.component';
import { ReceiptComponent } from './finance/receipt/receipt.component';
import { ReceiptsComponent } from './finance/receipts/receipts.component';
import { ShoppingComponent } from './finance/shopping/shopping.component';
import { StocksComponent } from './finance/stocks/stocks.component';
import { TaxComponent } from './finance/tax/tax.component';
import { HomeComponent } from './home/home.component';
import { I18nService } from './i18n.service';
import { LoginComponent } from './login/login.component';
import { Oauth2CallbackComponent } from './login/oauth2-callback/oauth2-callback.component';
import { LogoutComponent } from './logout/logout.component';
import { ReadingsComponent } from './meters/readings/readings.component';
import { NotepadComponent } from './notepad/notepad.component';
import { SearchComponent } from './search/search.component';
import { ButtonComponent } from './utils/button/button.component';
import { DummyComponent } from './utils/dummy/dummy.component';
import { H2Component } from './utils/h2/h2.component';
import { H3Component } from './utils/h3/h3.component';
import { H4Component } from './utils/h4/h4.component';
import { H5Component } from './utils/h5/h5.component';
import { IconComponent } from './utils/icon/icon.component';
import { PeriodDropdownMenuComponent } from './utils/period-dropdown-menu/period-dropdown-menu.component';
import { SorterIconComponent } from './utils/sorter-icon/sorter-icon.component';
import { SubNavbarComponent } from './utils/sub-navbar/sub-navbar.component';
import { TagComponent } from './utils/tag/tag.component';
import { ToastContainerComponent } from './utils/toast-container/toast-container.component';
import { ToastComponent } from './utils/toast/toast.component';
import { ToastsService } from './utils/toasts.service';
import { UiBusyIndicatorComponent } from './utils/ui-busy-indicator/ui-busy-indicator.component';
import { UiCenteredBusyIndicatorComponent } from './utils/ui-centered-busy-indicator/ui-centered-busy-indicator.component';
import { StorageRoomComponent } from './warehouse/storage-room/storage-room.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WorkLeadComponent } from './work/leads/lead/lead.component';
import { WorkLeadsComponent } from './work/leads/leads.component';
import { WorkCalendarComponent } from './work/settings/calendar/calendar.component';
import { WorkHolidaysComponent } from './work/settings/calendar/holidays/holidays.component';
import { WorkCustomerComponent } from './work/settings/customers/customer/customer.component';
import { WorkCustomersComponent } from './work/settings/customers/customers.component';
import { WorkProjectsComponent } from './work/settings/customers/projects/projects.component';
import { WorkOffCategoriesComponent } from './work/settings/off-categories/off-categories.component';
import { WorkTimeCategoriesComponent } from './work/settings/time-categories/time-categories.component';
import { WorkDayComponent } from './work/work-day/work-day.component';
import { WorkMonthComponent } from './work/work-month/work-month.component';
import { WorkYearComponent } from './work/work-year/work-year.component';
import { WorkComponent } from './work/work.component';
import { SettingsService } from './user/settings/settings.service';
import { DbRootdirComponent } from './db/filesystem/rootdir/rootdir.component';
import { DbExtensionsComponent } from './db/filesystem/extensions/extensions.component';

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
    FilesComponent,
    FileListItemComponent,
    CaseListItemComponent,
    CaseComponent,
    FolderBrowserDialogComponent,
    ReceiptsComponent,
    ReceiptComponent,
    DbClassesComponent,
    DbManagerComponent,
    ToastContainerComponent,
    ToastComponent,
    DbCountriesComponent,
    ShoppingComponent,
    H2Component,
    H3Component,
    H4Component,
    H5Component,
    PriceComparisonComponent,
    ButtonComponent,
    DbCurrenciesComponent,
    DbRoleComponent,
    DbPartyComponent,
    DbContactTypeComponent,
    PeriodDropdownMenuComponent,
    StocksComponent,
    AccountsComponent,
    ReadingsComponent,
    DummyComponent,
    WarehouseComponent,
    StorageRoomComponent,
    IconComponent,
    SorterIconComponent,
    TagComponent,
    SubNavbarComponent,
    TaxComponent,
    DbRootdirComponent,
    DbExtensionsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgChartsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [ConfigService],
      multi: true,
      useFactory: (configService: ConfigService) => () => configService.loadAppConfig()
    },
    { provide: I18nService, multi: false, },
    { provide: ToastsService, multi: false, },
    { provide: AuthService, multi: false, },
    { provide: SettingsService, multi: false, },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
