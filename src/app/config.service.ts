import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: AppConfig = <AppConfig>{
    loaded: false,
    icons: DefaultIcons
  };
  private startUrl: string = '';

  private cache: { [key: string]: any } = {};

  constructor(private http: HttpClient) {
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
        this.appConfig.icons = DefaultIcons;
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
  matchLink?: string;
  params?: string[];
}

export interface OAuth2Config {
  enabled: boolean;
  items: { [key: string]: OAuth2Item };
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

export const DefaultIcons: { [key: string]: string } = {
  'account': 'fa-solid fa-user',
  'add': 'fa-solid fa-plus',
  'bankAccount': 'fa-solid fa-wallet',
  'busy': 'fa-solid fa-fan fa-spin',
  'calendar': 'fa-solid fa-calendar-days',
  'cases': 'fa-solid fa-file-signature',
  'check': 'fa-regular fa-square-check',
  'check-no': 'fa-regular fa-square',
  'copy': 'fa-solid fa-copy',
  'class': 'fa-solid fa-fingerprint',
  'close': 'fa-solid fa-xmark',
  'cloud': 'fa-brands fa-cloudversify',
  'contacttype': 'fa-regular fa-address-card',
  'country': 'fa-solid fa-globe',
  'crypto': 'fa-solid fa-bitcoin-sign',
  'currency': 'fa-solid fa-coins',
  'dashboard': 'fa-solid fa-chart-pie',
  'database': 'fa-solid fa-database',
  'delete': 'fa-solid fa-trash',
  'download': 'fa-solid fa-cloud-arrow-down',
  'edit': 'fa-solid fa-pen',
  'error': 'fa-solid fa-triangle-exclamation',
  'file': 'fa-solid fa-file',
  'filter-price': 'fa-solid fa-filter-circle-dollar',
  'finance': 'fa-regular fa-money-bill-alt',
  'fingerprint': 'fa-solid fa-fingerprint',
  'folder': 'fa-solid fa-folder',
  'folder-up': 'fa-solid fa-turn-up fa-flip-horizontal',
  'go-down': 'fa-solid fa-caret-down',
  'go-left': 'fa-solid fa-caret-left',
  'go-right': 'fa-solid fa-caret-right',
  'go-up': 'fa-solid fa-caret-up',
  'goto': 'fa-solid fa-arrow-up-right-from-square',
  'grid': 'fa-solid fa-grip',
  'help': 'fa-regular fa-circle-question',
  'home': 'fa-solid fa-handshake-simple',
  'info': 'fa-solid fa-info-circle',
  'leads': 'fa-solid fa-funnel-dollar',
  'list': 'fa-solid fa-grip-lines',
  'locale': 'fa-solid fa-language',
  'login': 'fa-solid fa-user-lock',
  'menu': 'fa-solid fa-bars',
  'meter': 'fa-solid fa-gauge',
  'meter-reading': 'fa-solid fa-gauge-simple',
  'moving-boxes': 'fa-solid fa-people-carry-box',
  'notepad': 'fa-regular fa-lightbulb',
  'organic': 'fa-solid fa-seedling',
  'pin': 'fa-solid fa-map-pin',
  'preview': 'fa-solid fa-eye',
  'receipt': 'fa-solid fa-receipt',
  'role': 'fa-solid fa-user-shield',
  'rotate-left': 'fa-solid fa-rotate-left',
  'save': 'fa-solid fa-cloud-arrow-up',
  'search': 'fa-brands fa-searchengin',
  'settings': 'fa-solid fa-cog',
  'shopping': 'fa-solid fa-cart-shopping',
  'sortasc': 'fa-solid fa-arrow-down-a-z',
  'sortdesc': 'fa-solid fa-arrow-down-z-a',
  'star': 'fa-solid fa-star',
  'step-next': 'fa-solid fa-forward-step',
  'stocks': 'fa-solid fa-money-bills',
  'stopwatch': 'fa-solid fa-stopwatch',
  'tag': 'fa-solid fa-tag',
  'taxes': 'fa-solid fa-stamp',
  'taxrate': 'fa-solid fa-scale-balanced',
  'today': 'fa-solid fa-calendar-day',
  'toggle-off': 'fa-solid fa-toggle-off',
  'toggle-on': 'fa-solid fa-toggle-on',
  'warehouse': 'fa-solid fa-boxes-stacked',
  'wine': 'fa-solid fa-wine-bottle',
  'work': 'fa-solid fa-laptop-house',
  'year': 'fa-solid fa-calendar-alt',
  'x': 'fa-solid fa-x'
};
