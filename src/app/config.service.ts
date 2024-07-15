import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private cache: { [key: string]: any } = {};

  constructor(
    private deviceService?: DeviceDetectorService,
  ) { }

  getCacheItem(key: string): any | null {
    return this.cache[key];
  }

  isMobile(): boolean {
    return this.deviceService?.isMobile() || navigator.userAgent.toLowerCase().indexOf('mobile') > -1;
  }

  setCacheItem(key: string, obj: any): void {
    this.cache[key] = obj;
  }

}

export interface NavbarItem {
  callFn?: string;
  divider?: boolean;
  icon?: string;
  link?: string;
  matchLink?: string;
  params?: string[];
  title?: string;
}
