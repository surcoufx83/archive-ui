import { DragDropModule } from '@angular/cdk/drag-drop';
import { registerLocaleData } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgChartsModule } from 'ng2-charts';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxEchartsModule } from 'ngx-echarts';
import { MarkdownModule } from 'ngx-markdown';
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
import { DbExtensionsComponent } from './db/filesystem/extensions/extensions.component';
import { DbRootdirComponent } from './db/filesystem/rootdir/rootdir.component';
import { DbManagerComponent } from './db/manager/manager.component';
import { DbContactTypeComponent } from './db/parties/contacts/type/type.component';
import { DbPartyComponent } from './db/parties/party/party.component';
import { DbRoleComponent } from './db/parties/role/role.component';
import { ConfirmDeletionComponent } from './dialog/confirm-deletion/confirm-deletion.component';
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
import { StockOrdersComponent } from './finance/stock-orders/stock-orders.component';
import { StocksComponent } from './finance/stocks/stocks.component';
import { TaxComponent } from './finance/tax/tax.component';
import { HomeComponent } from './home/home.component';
import { I18nService } from './i18n.service';
import { ListManagerListItemComponent } from './list-manager/list-item/list-item.component';
import { ListManagerComponent } from './list-manager/list-manager.component';
import { ListManagerSidebarComponent } from './list-manager/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { Oauth2CallbackComponent } from './login/oauth2-callback/oauth2-callback.component';
import { LogoutComponent } from './logout/logout.component';
import { ReadingsComponent } from './meters/readings/readings.component';
import { NoteComponent } from './notepad2/note/note.component';
import { Notepad2Component } from './notepad2/notepad2.component';
import { SidebarComponent } from './notepad2/sidebar/sidebar.component';
import { SearchComponent } from './search/search.component';
import { AnimateOpacityInAndOutDirective } from './utils/animate-opacity-in-and-out.directive';
import { ButtonComponent } from './utils/button/button.component';
import { ContentEditableWithBindingDirective } from './utils/content-editable-with-binding.directive';
import { DummyComponent } from './utils/dummy/dummy.component';
import { H2Component } from './utils/h2/h2.component';
import { H3Component } from './utils/h3/h3.component';
import { H4Component } from './utils/h4/h4.component';
import { H5Component } from './utils/h5/h5.component';
import { IconComponent } from './utils/icon/icon.component';
import { NavbarComponent } from './utils/navbar/navbar.component';
import { PeriodDropdownMenuComponent } from './utils/period-dropdown-menu/period-dropdown-menu.component';
import { SettingsService } from './utils/settings.service';
import { SorterIconComponent } from './utils/sorter-icon/sorter-icon.component';
import { StorageService } from './utils/storage.service';
import { SubNavbarComponent } from './utils/sub-navbar/sub-navbar.component';
import { TagComponent } from './utils/tag/tag.component';
import { ToastContainerComponent } from './utils/toast-container/toast-container.component';
import { ToastComponent } from './utils/toast/toast.component';
import { ToastsService } from './utils/toasts.service';
import { TooltipDirective } from './utils/tooltip.directive';
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
import { WorkTravelEditorComponent } from './work/work-travel/editor/editor.component';
import { WorkTravelComponent } from './work/work-travel/work-travel.component';
import { WorkYearComponent } from './work/work-year/work-year.component';
import { WorkComponent } from './work/work.component';
import { WorkDayHeaderComponent } from './work/work-day/work-day-header/work-day-header.component';
import { WorkDayInfobox1Component } from './work/work-day/work-day-infobox1/work-day-infobox1.component';
import { WorkDayBookingsComponent } from './work/work-day/work-day-bookings/work-day-bookings.component';
import { WorkDayBookingFormComponent } from './work/work-day/work-day-booking-form/work-day-booking-form.component';
import { WorkDayTemplatesboxComponent } from './work/work-day/work-day-templatesbox/work-day-templatesbox.component';
import { WorkMonthHeaderComponent } from './work/work-month/work-month-header/work-month-header.component';
import { H2NewComponent } from './utils/h2-new/h2-new.component';
import { LinkBtnComponent } from './utils/link-btn/link-btn.component';
import { WorkMonthBoxInfoComponent } from './work/work-month/work-month-box-info/work-month-box-info.component';
import { CardComponent } from './utils/card/card.component';

registerLocaleData(localeDe);
registerLocaleData(localeFr);

@NgModule({
    declarations: [
        AccountComponent,
        AccountsComponent,
        AnimateOpacityInAndOutDirective,
        AppComponent,
        ButtonComponent,
        CaseComponent,
        CaseListItemComponent,
        CasesComponent,
        ConfirmDeletionComponent,
        ContentEditableWithBindingDirective,
        DashboardComponent,
        DbClassesComponent,
        DbContactTypeComponent,
        DbCountriesComponent,
        DbCurrenciesComponent,
        DbExtensionsComponent,
        DbManagerComponent,
        DbPartyComponent,
        DbRoleComponent,
        DbRootdirComponent,
        DummyComponent,
        FileComponent,
        FileListItemComponent,
        FilesComponent,
        FinanceComponent,
        FolderBrowserDialogComponent,
        H2Component,
        H3Component,
        H4Component,
        H5Component,
        HomeComponent,
        IconComponent,
        ListManagerComponent,
        ListManagerListItemComponent,
        ListManagerSidebarComponent,
        LoginComponent,
        LogoutComponent,
        NavbarComponent,
        NoteComponent,
        Notepad2Component,
        Oauth2CallbackComponent,
        PeriodDropdownMenuComponent,
        PriceComparisonComponent,
        ReadingsComponent,
        ReceiptComponent,
        ReceiptsComponent,
        SearchComponent,
        ShoppingComponent,
        SidebarComponent,
        SorterIconComponent,
        StockOrdersComponent,
        StocksComponent,
        StorageRoomComponent,
        SubNavbarComponent,
        TagComponent,
        TaxComponent,
        ToastComponent,
        ToastContainerComponent,
        TooltipDirective,
        UiBusyIndicatorComponent,
        UiCenteredBusyIndicatorComponent,
        WarehouseComponent,
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
        WorkTravelComponent,
        WorkTravelEditorComponent,
        WorkYearComponent,
        WorkDayHeaderComponent,
        WorkDayInfobox1Component,
        WorkDayBookingsComponent,
        WorkDayBookingFormComponent,
        WorkDayTemplatesboxComponent,
        WorkMonthHeaderComponent,
        H2NewComponent,
        LinkBtnComponent,
        WorkMonthBoxInfoComponent,
        CardComponent,
    ],
    bootstrap: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory, }),
        DragDropModule,
        FormsModule,
        MarkdownModule.forRoot(),
        NgChartsModule,
        NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
        ReactiveFormsModule,
    ],
    providers: [
        { provide: DeviceDetectorService, multi: false },
        { provide: I18nService, multi: false },
        { provide: ConfigService, multi: false, deps: [DeviceDetectorService] },
        { provide: StorageService, multi: false, deps: [ConfigService] },
        { provide: ToastsService, multi: false },
        provideHttpClient(withInterceptorsFromDi()),
        { provide: AuthService, multi: false, deps: [ConfigService, HttpClient, ToastsService, I18nService] },
        { provide: SettingsService, multi: false, deps: [AuthService, ConfigService, StorageService] },
    ]
})
export class AppModule { }
