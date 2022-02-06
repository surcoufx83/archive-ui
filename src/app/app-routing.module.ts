import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionGuard } from './session-guard.guard';
import { CasesComponent } from './cases/cases.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceComponent } from './finance/finance.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { NotepadComponent } from './notepad/notepad.component';
import { WorkComponent } from './work/work.component';

const routes: Routes = [
  { path: 'cases', component: CasesComponent, canActivate: [ SessionGuard ] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ SessionGuard ] },
  { path: 'home', component: HomeComponent, canActivate: [ SessionGuard ] },
  { path: 'finance', component: FinanceComponent, canActivate: [ SessionGuard ] },
  { path: 'login', component: LoginComponent, canActivate: [ SessionGuard ], pathMatch: 'full'},
  { path: 'logout', component: LogoutComponent, canActivate: [ SessionGuard ] },
  { path: 'notepad', component: NotepadComponent, canActivate: [ SessionGuard ] },
  { path: 'work', component: WorkComponent, canActivate: [ SessionGuard ] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
