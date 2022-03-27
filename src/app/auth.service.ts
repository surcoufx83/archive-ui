import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { ApiReply } from './api-reply';
import { ConfigService, AppConfig } from './config.service';
import { Session } from './session';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private loggedin: boolean = false;
  private session?: Session;
  private storeName: string = 'ArcApiv2__Session';

  constructor(private configService: ConfigService, private http: HttpClient, private router: Router) {
    let localSession: Session|string|null = localStorage.getItem(this.storeName);
    if (localSession != null) {
      localSession = <Session>JSON.parse(localSession);
      if (localSession.username == '' || localSession.token == '') {
        localStorage.removeItem(this.storeName);
      } else {
        this.session = <Session>localSession;
        this.loggedin = true;
      }
    }
    setTimeout(() => { this.ping(); }, 60000);
  }

  private get config() : AppConfig {
    return this.configService.config;
  }

  public download(url: string) : Subject<any> {
    let reply: Subject<any> = new Subject<any>();
    if (this.session == undefined) {
      reply.next({ success: false });
      return reply;
    }
    this.http.get(url, { 
        headers: this.header,
        responseType: 'blob'
      }).subscribe((result) => {
        reply.next(result);
      });
    return reply;
  }

  get hasSession() : boolean {
    return (this.session != undefined);
  }

  private get header() : HttpHeaders{
    let header = new HttpHeaders();
    if (this.config.auth.basic.enabled) 
      header = header.append('Authorization', 'Basic ' + window.btoa(this.config.auth.basic.user + ':' + this.config.auth.basic.password));
    if (this.session)
      header = header.append('AuthToken', this.session.token);
    return header;
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
    let url = this.config.auth.authUrl;
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
    localStorage.removeItem(this.storeName);
    this.session = undefined;
    this.loggedin = false;
    this.router.navigate(['login']);
  }

  public processOauth2Redirect(state: string, code: string) : Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.isLoggedin) {
      reply.next({ success: false });
      return reply;
    }
    if (this.config.auth.oauth2.state !== state) {
      reply.next({ success: false });
      return reply;
    }
    let formdata = new FormData();
    formdata.append('archauth_oauth2_code', code);
    formdata.append('archauth_oauth2_state', state);
    this.http.post<ApiReply>(this.config.auth.oauth2.tokenEndpoint, formdata).subscribe(
      (response) => {
        if (response.success && response.payload != undefined) {
          this.session = {
            token: response.payload['token'],
            username: this.config.auth.oauth2.state
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

  private ping() : void {
    if (this.isLoggedin) {
      this.queryApi(this.config.api.baseUrl + '/ping').subscribe((reply) => {
        setTimeout(() => { this.ping(); }, 60000);
      });
    }
    else
      setTimeout(() => { this.ping(); }, 60000);
  }

  public queryApi(url: string, payload: any = {}) : Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.session == undefined) {
      reply.next({ success: false });
      return reply;
    }
    this.http.get<ApiReply>(url, { headers: this.header}).subscribe(
      (response) => {
        reply.next(response);
      },
      (error) => {
        console.log(error);
        reply.next({ success: false });
        if (error.status === 401) {
          this.logout();
        }
      }
    );
    return reply;
  }

  public updateApi(url: string, payload: any = {}) : Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.session == undefined) {
      reply.next({ success: false });
      return reply;
    }
    this.http.post<ApiReply>(url, payload, { headers: this.header}).subscribe(
      (response) => {
        reply.next(response);
      },
      (error) => {
        console.log(error);
        reply.next({ success: false });
        if (error.status === 401) {
          this.logout();
        }
      }
    );
    return reply;
  }

  ngOnInit() : void {

  }

}
