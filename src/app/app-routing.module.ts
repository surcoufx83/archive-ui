import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { CaseComponent } from './cases/case/case.component';
import { CasesComponent } from './cases/cases.component';
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
import { FileComponent } from './files/file/file.component';
import { FilesComponent } from './files/files/files.component';
import { AccountsComponent } from './finance/accounts/accounts.component';
import { FinanceComponent } from './finance/finance.component';
import { PriceComparisonComponent } from './finance/price-comparison/price-comparison.component';
import { ReceiptsComponent } from './finance/receipts/receipts.component';
import { ShoppingComponent } from './finance/shopping/shopping.component';
import { StocksComponent } from './finance/stocks/stocks.component';
import { TaxComponent } from './finance/tax/tax.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Oauth2CallbackComponent } from './login/oauth2-callback/oauth2-callback.component';
import { LogoutComponent } from './logout/logout.component';
import { ReadingsComponent } from './meters/readings/readings.component';
import { NotepadComponent } from './notepad/notepad.component';
import { SearchComponent } from './search/search.component';
import { SessionGuard } from './session-guard.guard';
import { DummyComponent } from './utils/dummy/dummy.component';
import { StorageRoomComponent } from './warehouse/storage-room/storage-room.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WorkLeadComponent } from './work/leads/lead/lead.component';
import { WorkLeadsComponent } from './work/leads/leads.component';
import { WorkCustomerComponent } from './work/settings/customers/customer/customer.component';
import { WorkCustomersComponent } from './work/settings/customers/customers.component';
import { WorkDayComponent } from './work/work-day/work-day.component';
import { WorkMonthComponent } from './work/work-month/work-month.component';
import { WorkComponent } from './work/work.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [SessionGuard] },
  {
    path: 'case/:id', component: CaseComponent, canActivate: [SessionGuard], children: [
      { path: 'childs', component: DummyComponent },
      { path: 'files', component: DummyComponent },
      { path: 'times', component: DummyComponent },
      { path: '', component: DummyComponent },
    ]
  },
  { path: 'cases', component: CasesComponent, canActivate: [SessionGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [SessionGuard] },
  {
    path: 'db', children: [
      { path: 'classes', component: DbClassesComponent, canActivate: [SessionGuard] },
      { path: 'countries', component: DbCountriesComponent, canActivate: [SessionGuard] },
      { path: 'currencies', component: DbCurrenciesComponent, canActivate: [SessionGuard] },
      { path: 'dirs', component: DbRootdirComponent, canActivate: [SessionGuard] },
      { path: 'extensions', component: DbExtensionsComponent, canActivate: [SessionGuard] },
      {
        path: 'parties', canActivate: [SessionGuard], children:
          [
            { path: '', component: DbPartyComponent, canActivate: [SessionGuard], pathMatch: 'full' },
            {
              path: 'contacts', canActivate: [SessionGuard], children:
                [
                  { path: 'types', component: DbContactTypeComponent, canActivate: [SessionGuard] },
                ]
            },
            { path: 'roles', component: DbRoleComponent, canActivate: [SessionGuard] },
          ]
      },
      { path: '', component: DbManagerComponent, canActivate: [SessionGuard], pathMatch: 'full' },
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [SessionGuard] },
  { path: 'file/:id/:view', component: FileComponent, canActivate: [SessionGuard] },
  { path: 'file/:id', component: FileComponent, canActivate: [SessionGuard] },
  { path: 'files/:id', component: FilesComponent, canActivate: [SessionGuard] },
  { path: 'files', component: FilesComponent, canActivate: [SessionGuard], pathMatch: 'full' },
  {
    path: 'finance', component: FinanceComponent, canActivate: [SessionGuard], children: [
      { path: 'accounts', component: AccountsComponent, canActivate: [SessionGuard] },
      { path: 'stocks', component: StocksComponent, canActivate: [SessionGuard] },
      { path: 'taxes/:year', component: TaxComponent, canActivate: [SessionGuard] },
    ]
  },
  { path: 'login', component: LoginComponent, canActivate: [SessionGuard], pathMatch: 'full' },
  { path: 'login/oauth2', component: Oauth2CallbackComponent, canActivate: [SessionGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [SessionGuard] },
  { path: 'notepad', component: NotepadComponent, canActivate: [SessionGuard] },
  { path: 'price-comparison', component: PriceComparisonComponent, canActivate: [SessionGuard] },
  { path: 'readings', component: ReadingsComponent, canActivate: [SessionGuard], pathMatch: 'full' },
  { path: 'receipts', component: ReceiptsComponent, canActivate: [SessionGuard] },
  { path: 'shopping', component: ShoppingComponent, canActivate: [SessionGuard] },
  { path: 'search/:phrase/:token/:tab', component: SearchComponent, canActivate: [SessionGuard] },
  { path: 'search/:phrase/:token', component: SearchComponent, canActivate: [SessionGuard], pathMatch: 'full' },
  { path: 'search/:phrase', component: SearchComponent, canActivate: [SessionGuard], pathMatch: 'full' },
  { path: 'search', component: SearchComponent, canActivate: [SessionGuard], pathMatch: 'full' },
  { path: 'warehouse/:roomid/:roomname', component: StorageRoomComponent, canActivate: [SessionGuard] },
  { path: 'warehouse/:room', component: StorageRoomComponent, canActivate: [SessionGuard] },
  { path: 'warehouse', component: WarehouseComponent, pathMatch: 'full', canActivate: [SessionGuard] },
  {
    path: 'work', component: WorkComponent, canActivate: [SessionGuard], children: [
      { path: '', redirectTo: 'today', pathMatch: 'full' },
      { path: 'day/:date', component: WorkDayComponent, canActivate: [SessionGuard] },
      { path: 'leads', component: WorkLeadsComponent, canActivate: [SessionGuard] },
      { path: 'lead/:id', component: WorkLeadComponent, canActivate: [SessionGuard] },
      { path: 'month', component: WorkMonthComponent, canActivate: [SessionGuard] },
      { path: 'month/:year/:month', component: WorkMonthComponent, canActivate: [SessionGuard] },
      {
        path: 'settings', children: [
          { path: 'customer/:id', component: WorkCustomerComponent, canActivate: [SessionGuard] },
          { path: 'customers', component: WorkCustomersComponent, canActivate: [SessionGuard] },
        ]
      },
      { path: 'today', component: WorkDayComponent, canActivate: [SessionGuard] },
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
