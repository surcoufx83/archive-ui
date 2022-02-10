import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterEvent, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.auth.isLoggedin) {
      if (!state.url.startsWith('/login')) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
    }
    if (state.url.startsWith('/login')) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }

}
