import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: AppConfig = <AppConfig>{ loaded: false };
  private startUrl: string = '';

  private cache: { [key: string]: any } = {};

  constructor(private http: HttpClient, private router: Router) {
    this.startUrl = location.href.substr(location.href.indexOf('#') + 1);
  }

  get config(): AppConfig {
    return this.appConfig;
  }

  getCacheItem(key: string): any | null {
    return this.cache[key];
  }

  loadAppConfig() {
    return this.http.get('/assets/config/config.json')
      .toPromise()
      .then(config => {
        this.appConfig = <AppConfig>config;
        this.appConfig.api.startUrl = this.startUrl;
        this.appConfig.loaded = true;
      });
  }

  setCacheItem(key: string, obj: any): void {
    this.cache[key] = obj;
  }

}

export interface ApiConfig {
  baseUrl: string;
  startUrl: string;
}

export interface AppConfig {
  api: ApiConfig;
  auth: AuthConfig;
  icons: { [key: string]: string };
  loaded: boolean;
  navbar: NavbarConfig;
  storage: StorageConfig;
}

export interface AuthConfig {
  authUrl: string;
  authCheck: string;
  basic: BasicAuthConfig;
  oauth2: OAuth2Config;
}

export interface BasicAuthConfig {
  enabled: boolean;
  user: string;
  password: string;
}

export interface NavbarConfig {
  items: NavbarItem[];
  financeitems: NavbarItem[];
  workitems: NavbarItem[];
}

export interface NavbarItem {
  title: string;
  icon: string;
  link: string;
}

export interface OAuth2Config {
  enabled: boolean;
  items: {[key: string]: OAuth2Item};
}

export interface OAuth2Item {
  endpoint: string;
  tokenEndpoint: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  state: string;
}

export interface StorageConfig {
  prefix: string;
}
