import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { EnvironmentOAuth2Provider } from 'src/environments/types';
import { ConfigService } from './config.service';
import { I18nService } from './i18n.service';
import { ApiReply, Session } from './if';
import { ToastsService } from './utils/toasts.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedin: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  public isLoggedIn = this.loggedin.asObservable();
  private oauthProvider: EnvironmentOAuth2Provider;
  private session?: Session;
  private storeName: string = `${environment}Session`;

  constructor(
    configService: ConfigService,
    private http: HttpClient,
    private toastService: ToastsService,
    private i18nService: I18nService) {
    if (!Object.keys(environment.api.auth.oauth2Providers).includes(location.hostname)) {
      throw new Error(`The app configuration does not include the current hostname. Therefore this website will not work.`);
    }
    else
      this.oauthProvider = environment.api.auth.oauth2Providers[location.hostname];
    let localSession: Session | string | null = localStorage.getItem(this.storeName);
    if (localSession != null) {
      localSession = <Session>JSON.parse(localSession);
      if (localSession.username == '' || localSession.token == '') {
        localStorage.removeItem(this.storeName);
      } else {
        this.session = <Session>localSession;
        this.loggedin.next(true);
      }
    }
    if (this.loggedin.value == undefined)
      this.loggedin.next(false);
    setTimeout(() => { this.ping(); }, 60000);
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

  private get header(): { [key: string]: string } {
    return { AuthToken: this.session?.token || '' };
  }

  get isLoggedin(): boolean {
    return this.loggedin.value ?? false;
  }

  public login(username: string, password: string): Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    let formdata = new FormData();
    formdata.append('archauth_login_username', username);
    formdata.append('archauth_login_password', password);
    let url = `${environment.api.baseUrl}/auth/login`;
    this.http.post<ApiReply>(url, formdata).subscribe(
      (response) => {
        if (response.success && response.payload != undefined) {
          this.session = {
            token: response.payload['token'],
            username: username
          };
          localStorage.setItem(this.storeName, JSON.stringify(this.session));
          this.loggedin.next(true);
          location.replace('/home');
          return;
        } else {
          reply.next({
            success: false,
            status: response.status
          });
        }
      },
      (error) => {
        reply.next({
          success: false,
          status: error.status
        });
      }
    );
    return reply;
  }

  public logout() {
    localStorage.removeItem(this.storeName);
    this.session = undefined;
    this.loggedin.next(false);
    location.replace('/login');
  }

  public processOauth2Redirect(state: string, code: string): Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.isLoggedin) {
      reply.next({ success: false, status: HttpStatusCode.TooEarly });
      return reply;
    }
    if (this.oauthProvider.state !== state) {
      reply.next({ success: false, status: HttpStatusCode.TooEarly });
      return reply;
    }
    let formdata = new FormData();
    formdata.append('archauth_oauth2_code', code);
    formdata.append('archauth_oauth2_state', state);
    this.http.post<ApiReply>(`${environment.api.baseUrl}/auth/oauth2`, formdata).subscribe(
      (response) => {
        if (response.success && response.payload != undefined) {
          this.session = {
            token: response.payload['token'],
            username: this.oauthProvider.state
          };
          localStorage.setItem(this.storeName, JSON.stringify(this.session));
          location.replace('/home');
          return;
        } else {
          reply.next({ success: false, status: response.status });
          this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
            this.i18nService.i18n('authService.apiError.message', [response.error ?? '']));
        }
      },
      (e: HttpErrorResponse) => {
        reply.next({ success: false, status: e.status });
        this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
          this.i18nService.i18n('authService.apiError.message', [e.statusText]));
      }
    );
    return reply;
  }

  private ping(): void {
    if (this.isLoggedin) {
      this.queryApi(`${environment.api.baseUrl}/ping`).subscribe(() => {
        setTimeout(() => { this.ping(); }, 600000);
      });
    }
    else
      setTimeout(() => { this.ping(); }, 60000);
  }

  public queryApi(url: string, payload: any = {}, etag?: string): Subject<ApiReply> {
    let reply: Subject<ApiReply> = new Subject<ApiReply>();
    if (this.session == undefined) {
      reply.next({ success: false, status: HttpStatusCode.TooEarly });
      return reply;
    }
    let tempheader = { ...this.header };
    if (etag)
      tempheader['If-None-Match'] = etag;
    this.http.get(url, { headers: tempheader, observe: 'response' }).subscribe({
      next: (response) => {
        let etagarr = /^([wW]\/)?\"?(?<etag>[^"]+)\"?$/.exec(response.headers.get('Etag') ?? '');
        let etag = undefined;
        if (etagarr != null && etagarr.groups != undefined && etagarr.groups['etag'] != undefined)
          etag = etagarr.groups['etag'];
        if (response.status === 204)
          reply.next({ success: true, errno: response.status, etag: etag, status: response.status });
        else {
          let tempreply = <ApiReply><unknown>(response.body);
          tempreply.etag = etag;
          tempreply.status = response.status;
          reply.next(tempreply);
        }
        reply.complete();
      },
      error: (e: HttpErrorResponse) => {
        if (e.status == HttpStatusCode.NotModified) {
          reply.next({ success: true, status: e.status });
          reply.complete();
          return;
        }
        console.log(e);
        let etagarr = /^([wW]\/)?\"?(?<etag>[^"]+)\"?$/.exec(e.headers.get('Etag') ?? '');
        let etag = undefined;
        if (etagarr != null && etagarr.groups != undefined && etagarr.groups['etag'] != undefined)
          etag = etagarr.groups['etag'];
        reply.next({ success: false, etag: etag, status: e.status });
        reply.complete();
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
      reply.next({ success: false, status: HttpStatusCode.TooEarly });
      return reply;
    }
    this.http.post<ApiReply>(url, payload, { headers: this.header }).subscribe({
      next: (response) => reply.next(response),
      error: (e: HttpErrorResponse) => {
        reply.next({ success: false, status: e.status });
        if (e.status === 304) {
          this.toastService.confirm(this.i18nService.i18n('authService.notModified.title'),
            this.i18nService.i18n('authService.notModified.message', [e.statusText]));
          return;
        }
        console.log(e);
        this.toastService.error(this.i18nService.i18n('authService.apiError.title'),
          this.i18nService.i18n('authService.apiError.message', [e.statusText]));
        if (e.status === 401) {
          this.logout();
        }
      }
    });
    return reply;
  }

  public updateApi2(urlpart: string, payload: any = {}): Subject<ApiReply> {
    return this.updateApi(`${environment.api.baseUrl}/${urlpart}`, payload);
  }

}
