import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiReply } from './api-reply';
import { ConfigService } from './config.service';
import { Session } from './session';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private checked: boolean = false;
  private loggedin: boolean = false;
  private session?: Session;
  private storeName: string = '';

  constructor(private configService: ConfigService, private http: HttpClient) {
    this.storeName = this.configService.StoragePrefix + 'Session';
    let localSession: Session|string|null = localStorage.getItem(this.storeName);
    if (localSession != null) {
      localSession = <Session>JSON.parse(localSession);
      if (localSession.username == '' || localSession.token == '') {
        localStorage.removeItem(this.storeName);
      } else {
        this.session = <Session>localSession;
      }
    }
    else
      this.checked = true;
  }

  public checkSession() : Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    let url = this.configService.AuthCheckUrl;
    this.queryApi(url).subscribe(
      (response) => {
        if (response.success) {
          this.loggedin = true;
        } else {
          this.session = undefined;
          this.loggedin = false;
        }
        this.checked = true;
        reply.next({ success: true });
      },
      (error) => {
        this.session = undefined;
        this.loggedin = false;
        this.checked = true;
        reply.next({ success: false });
      }
    );
    return reply;
  }

  get hasChecked() : boolean {
    return this.checked;
  }

  get hasSession() : boolean {
    return (this.session != undefined);
  }

  get isLoggedin() : boolean {
    return this.loggedin;
  }

  /**
   * login
   */
  public login(username: string, password: string) : Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    let formdata = new FormData();
    formdata.append('archauth_login_username', username);
    formdata.append('archauth_login_password', password);
    let url = this.configService.AuthUrl;
    this.http.post<ApiReply>(url, formdata).subscribe(
      (response) => {
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

  public queryApi(url: string, payload: any = {}) : Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.session == undefined) {
      reply.next({ success: false });
      return reply;
    }
    this.http.post<ApiReply>(url, payload, { headers: new HttpHeaders().set('AuthToken', this.session.token)}).subscribe(
      (response) => {
        reply.next(response);
      },
      (error) => {
        console.log(error);
        reply.next({ success: false });
      }
    );
    return reply;
  }

  ngOnInit() : void {

  }

}
