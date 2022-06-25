import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ApiReply } from './api-reply';
import { ConfigService, AppConfig } from './config.service';
import { Session } from './session';
import { Router } from '@angular/router';
import { ToastsService } from './utils/toasts.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private loggedin: boolean = false;
  private session?: Session;
  private storeName: string = 'ArcApiv2__Session';

  constructor(private configService: ConfigService,
    private http: HttpClient,
    private router: Router,
    private toastService: ToastsService,
    private i18nService: I18nService) {
    let localSession: Session | string | null = localStorage.getItem(this.storeName);
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

  private get config(): AppConfig {
    return this.configService.config;
  }

  public download(url: string): Subject<any> {
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

  get hasSession(): boolean {
    return (this.session != undefined);
  }

  private get header(): HttpHeaders {
    let header = new HttpHeaders();
    if (this.config.auth.basic.enabled)
      header = header.append('Authorization', 'Basic ' + window.btoa(this.config.auth.basic.user + ':' + this.config.auth.basic.password));
    if (this.session)
      header = header.append('AuthToken', this.session.token);
    return header;
  }

  get isLoggedin(): boolean {
    return this.loggedin;
  }

  /**
   * login
   */
  public login(username: string, password: string): Subject<ApiReply> {
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

  public processOauth2Redirect(state: string, code: string): Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    let hostconfig = this.config.auth.oauth2.items[window.location.host];
    if (!hostconfig) {
      return reply;
    }
    if (this.isLoggedin) {
      reply.next({ success: false });
      return reply;
    }
    if (hostconfig.state !== state) {
      reply.next({ success: false });
      return reply;
    }
    let formdata = new FormData();
    formdata.append('archauth_oauth2_code', code);
    formdata.append('archauth_oauth2_state', state);
    this.http.post<ApiReply>(hostconfig.tokenEndpoint, formdata).subscribe(
      (response) => {
        if (response.success && response.payload != undefined) {
          this.session = {
            token: response.payload['token'],
            username: hostconfig.state
          };
          localStorage.setItem(this.storeName, JSON.stringify(this.session));
          location.replace('/home');
          return;
        } else {
          reply.next({ success: false });
          this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
            this.i18nService.i18n('authService.apiError.message', [response.error ?? '']));
        }
      },
      (e: HttpErrorResponse) => {
        reply.next({ success: false });
        this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
          this.i18nService.i18n('authService.apiError.message', [e.statusText]));
      }
    );
    return reply;
  }

  private ping(): void {
    if (this.isLoggedin) {
      this.queryApi(this.config.api.baseUrl + '/ping').subscribe(() => {
        setTimeout(() => { this.ping(); }, 600000);
      });
    }
    else
      setTimeout(() => { this.ping(); }, 60000);
  }

  public queryApi(url: string, payload: any = {}): Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.session == undefined) {
      reply.next({ success: false });
      return reply;
    }
    this.http.get<ApiReply>(url, { headers: this.header }).subscribe({
      next: (response) => reply.next(response),
      error: (e: HttpErrorResponse) => {
        console.log(e);
        reply.next({ success: false });
        this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
          this.i18nService.i18n('authService.apiError.message', [e.statusText]));
        if (e.status === 401) {
          this.logout();
        }
      }
    });
    return reply;
  }

  public updateApi(url: string, payload: any = {}): Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.session == undefined) {
      reply.next({ success: false });
      return reply;
    }
    this.http.post<ApiReply>(url, payload, { headers: this.header }).subscribe({
      next: (response) => reply.next(response),
      error: (e: HttpErrorResponse) => {
        console.log(e);
        reply.next({ success: false });
        this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
          this.i18nService.i18n('authService.apiError.message', [e.statusText]));
        if (e.status === 401) {
          this.logout();
        }
      }
    });
    return reply;
  }

  ngOnInit(): void {

  }

}
