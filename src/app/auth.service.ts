import { Injectable } from '@angular/core';
import { Session } from './session';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user?: User;
  private session?: Session;

  private clientid: string = 'archive-ui-client';
  private clientLoginUrl: string = '/auth/login';
  private clientLogoutUrl: string = '/auth/logout';

  constructor() { }

  /**
   * isLoggedin
   */
  public isLoggedin() : boolean {
    return (this.user !== undefined && this.session != undefined);
  }

  /**
   * login
   */
  public login(username: string, password: string) {
    console.log('AuthService.login()', username);
    this.user = new User(username);
    this.session = new Session('jhsadhshdjhs');
    location.href = '/';
  }

  /**
   * logout
   */
  public logout() {
    console.log('AuthService.logout()');

  }

}
