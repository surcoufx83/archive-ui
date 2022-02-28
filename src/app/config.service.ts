import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SearchResults } from './search/searchresult';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: AppConfig = <AppConfig>{ loaded: false };
  private startUrl: string = '';
  private searches: SearchResults[] = [];
  private searchIndexes: string[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.startUrl = location.href.substr(location.href.indexOf('#') + 1);
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

  get config() : AppConfig {
    return this.appConfig;
  }

  getSearchResult(key: string) : SearchResults|null {
    for (let i = 0; i < this.searchIndexes.length; i++) {
      if (this.searchIndexes[i] === key)
        return this.searches[i];
    }
    return null;
  }

  setSearchResult(key: string, result: SearchResults) : void {
    if (this.searches.length === 5) {
      this.searches.splice(0, 1);
      this.searchIndexes.splice(0, 1);
    }
    this.searches.push(result);
    this.searchIndexes.push(key);
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
  oauth2: OAuth2Config;
}

export interface NavbarConfig {
  items: NavbarItem[];
  workitems: NavbarItem[];
}

export interface NavbarItem {
  title: string;
  icon: string;
  link: string;
}

export interface OAuth2Config {
  enabled: boolean;
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
