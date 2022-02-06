import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiReply } from './api-reply';
import { ConfigService } from './config.service';
import { Session } from './session';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private session?: Session;
  private storeName: string = '';

  private clientid: string = 'archive-ui-client';
  private clientLoginUrl: string = '/auth/login';
  private clientLogoutUrl: string = '/auth/logout';

  constructor(private configService: ConfigService, private http: HttpClient) {
    this.storeName = this.configService.StoragePrefix + 'Session';
    let localSession: Session|string|null = localStorage.getItem(this.storeName);
    if (localSession != null) {
      localSession = <Session>JSON.parse(localSession);
      if (localSession.username == '' || localSession.token == '') {
        localStorage.removeItem(this.storeName);
      } else {
        this.session = localSession;
      }
    }
  }

  /**
   * isLoggedin
   */
  public isLoggedin() : boolean {
    return (this.session != undefined);
  }

  /**
   * login
   */
  public login(username: string, password: string) : Subject<ApiReply> {
    console.log('AuthService.login()', username);
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    let formdata = new FormData();
    formdata.append('archauth_login_username', username);
    formdata.append('archauth_login_password', password);
    let url = this.configService.AuthUrl;
    this.http.post<ApiReply>(url, formdata).subscribe(
      (response) => {
        console.log(response);
        if (response.success && response.payload != undefined) {
          this.session = {
            token: response.payload['token'],
            username: username
          };
          localStorage.setItem(this.storeName, JSON.stringify(this.session));
          location.replace('/home');
          return;
        } else {
          reply.next({
            success: false,
          });
        }
      },
      (error) => {
        console.log(error);
        reply.next({
          success: false,
        });
      }
    );
    return reply;
  }

  /**
   * logout
   */
  public logout() {
    console.log('AuthService.logout()');

  }

}
