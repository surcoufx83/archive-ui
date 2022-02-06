import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterEvent, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private auth: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (state.url.startsWith('/login'))
      return !this.auth.isLoggedin;
    return this.auth.isLoggedin;
  }

}
