import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SessionGuard } from './session-guard.guard';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ SessionGuard ] },
  { path: 'logout', component: LogoutComponent, canActivate: [ SessionGuard ] },
  { path: '', component: LoginComponent, canActivate: [ SessionGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
