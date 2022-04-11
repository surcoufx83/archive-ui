import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionGuard } from './session-guard.guard';

import { AccountComponent } from './account/account.component';
import { CasesComponent } from './cases/cases.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceComponent } from './finance/finance.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotepadComponent } from './notepad/notepad.component';
import { Oauth2CallbackComponent } from './login/oauth2-callback/oauth2-callback.component';
import { WorkCustomerComponent } from './work/settings/customers/customer/customer.component';
import { WorkCustomersComponent } from './work/settings/customers/customers.component';
import { WorkComponent } from './work/work.component';
import { WorkDayComponent } from './work/work-day/work-day.component';
import { WorkLeadComponent } from './work/leads/lead/lead.component';
import { WorkLeadsComponent } from './work/leads/leads.component';
import { WorkMonthComponent } from './work/work-month/work-month.component';
import { SearchComponent } from './search/search.component';
import { FileComponent } from './files/file/file.component';
import { FilesComponent } from './files/files/files.component';
import { CaseComponent } from './cases/case/case.component';
import { ReceiptsComponent } from './finance/receipts/receipts.component';
import { DbClassesComponent } from './db/classes/classes.component';
import { DbManagerComponent } from './db/manager/manager.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [ SessionGuard ] },
  { path: 'case/:id', component: CaseComponent, canActivate: [ SessionGuard ] },
  { path: 'cases', component: CasesComponent, canActivate: [ SessionGuard ] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ SessionGuard ] },
  { path: 'db', children: [
    { path: 'classes', component: DbClassesComponent, canActivate: [ SessionGuard ] },
    { path: '', component: DbManagerComponent, canActivate: [ SessionGuard ], pathMatch: 'full' },
  ]},
  { path: 'home', component: HomeComponent, canActivate: [ SessionGuard ] },
  { path: 'file/:id/:view', component: FileComponent, canActivate: [ SessionGuard ] },
  { path: 'file/:id', component: FileComponent, canActivate: [ SessionGuard ] },
  { path: 'files/:id', component: FilesComponent, canActivate: [ SessionGuard ] },
  { path: 'files', component: FilesComponent, canActivate: [ SessionGuard ], pathMatch: 'full' },
  { path: 'finance', component: FinanceComponent, canActivate: [ SessionGuard ] },
  { path: 'login', children: [
    { path: 'oauth2', component: Oauth2CallbackComponent, canActivate: [ SessionGuard ] },
    { path: '', component: LoginComponent, canActivate: [ SessionGuard ], pathMatch: 'full' },
  ]},
  { path: 'logout', component: LogoutComponent, canActivate: [ SessionGuard ] },
  { path: 'notepad', component: NotepadComponent, canActivate: [ SessionGuard ] },
  { path: 'receipts', component: ReceiptsComponent, canActivate: [ SessionGuard ] },
  { path: 'search/:phrase/:token/:tab', component: SearchComponent, canActivate: [ SessionGuard ] },
  { path: 'search/:phrase/:token', component: SearchComponent, canActivate: [ SessionGuard ], pathMatch: 'full' },
  { path: 'search/:phrase', component: SearchComponent, canActivate: [ SessionGuard ], pathMatch: 'full' },
  { path: 'search', component: SearchComponent, canActivate: [ SessionGuard ], pathMatch: 'full' },
  { path: 'work', component: WorkComponent, canActivate: [ SessionGuard ], children: [
    { path: '', redirectTo: 'today', pathMatch: 'full' },
    { path: 'day/:date', component: WorkDayComponent, canActivate: [ SessionGuard ] },
    { path: 'leads', component: WorkLeadsComponent, canActivate: [ SessionGuard ] },
    { path: 'lead/:id', component: WorkLeadComponent, canActivate: [ SessionGuard ] },
    { path: 'month', component: WorkMonthComponent, canActivate: [ SessionGuard ] },
    { path: 'month/:year/:month', component: WorkMonthComponent, canActivate: [ SessionGuard ] },
    { path: 'settings', children: [
      { path: 'customer/:id', component: WorkCustomerComponent, canActivate: [ SessionGuard ] },
      { path: 'customers', component: WorkCustomersComponent, canActivate: [ SessionGuard ] },
    ]},
    { path: 'today', component: WorkDayComponent, canActivate: [ SessionGuard ] },
  ]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
