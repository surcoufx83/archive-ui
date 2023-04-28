import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private items: { [key: string]: StorageItem } = { ...defaultStorageSettingsitems };

  constructor(private configService: ConfigService) {
    this.loadSelf();
  }

  public clearAllTimeouts(): void {
    Object.values(this.items).forEach((i) => clearTimeout(i.timeout));
  }

  public clearCache(): void {
    Object.keys(this.items).forEach((key) => {
      clearTimeout(this.items[key].timeout);
      localStorage.removeItem(this.getStorageName(key));
    });
    this.items = defaultStorageSettingsitems;
  }

  public clearTimeout(key: string): void {
    if (this.items[key] == undefined)
      console.error(`StorageService.clearTimeout(${key}): invalid param key.`);
    clearTimeout(this.items[key].timeout);
  }

  public getExpectedStorageVersion(key: string): number {
    if (this.items[key] == undefined)
      console.error(`StorageService.expectedStorageVersion(${key}): invalid param key.`);
    return defaultStorageSettingsitems[key].expectedVersion ?? 0;
  }

  public getLastSync(key: string): number {
    if (this.items[key] == undefined)
      console.error(`StorageService.getLastSync(${key}): invalid param key.`);
    return this.items[key].lastsync ?? 0;
  }

  private getStorageName(key: string): string {
    return `${this.configService.config.storage.prefix}__${key}`;
  }

  public getSyncInterval(key: string): number {
    if (this.items[key] == undefined)
      console.error(`StorageService.getSyncInterval(${key}): invalid param key.`);
    return this.items[key].syncInterval ?? 0;
  }

  public getSyncUrl(key: string): string {
    if (this.items[key] == undefined) {
      console.error(`StorageService.getSyncUrl(${key}): invalid param key.`);
      return 'false';
    }
    return `${this.configService.config.api.baseUrl}${this.items[key].urlFragment}`
      + (this.items[key].lastsync > 0 ? `/${Math.floor(this.items[key].lastsync / 1000)}` : '');
  }

  public getTimeout(key: string): any {
    if (this.items[key] == undefined)
      console.error(`StorageService.getTimeout(${key}): invalid param key.`);
    return this.items[key].timeout ?? null;
  }

  public load(key: string): string | null {
    if (this.items[key] == undefined) {
      console.error(`StorageService.load(${key}): invalid param key.`);
      return null;
    }
    return localStorage.getItem(this.getStorageName(key));
  }

  private loadSelf() : void {
    let olddata: string | null = localStorage.getItem(this.getStorageName('inf'));
    let oldobj: { [key: string]: StorageItem } | null = olddata != null ? JSON.parse(olddata) : null;
    if (olddata != null && oldobj!['inf'].version == this.items['inf'].expectedVersion) {
      this.items = oldobj!;
      Object.keys(this.items).forEach((key) => {
        if (this.items[key].version !== defaultStorageSettingsitems[key].expectedVersion)
          localStorage.removeItem(this.getStorageName(key));
      });
    }
    else
      this.saveSelf();
  }

  public save(key: string, data: any): void {
    if (this.items[key] == undefined) {
      console.error(`StorageService.save(${key}): invalid param key.`);
      return;
    }
    localStorage.setItem(this.getStorageName(key), JSON.stringify(data));
    this.items[key].version = defaultStorageSettingsitems[key].expectedVersion;
    this.items[key].expectedVersion = defaultStorageSettingsitems[key].expectedVersion;
    this.saveSelf();
  }

  private saveSelf() {
    this.items['inf'].lastsync = Date.now();
    return localStorage.setItem(this.getStorageName('inf'), JSON.stringify(this.items));
  }

  public setLastSync(key: string, when?: number): void {
    if (this.items[key] == undefined)
      console.error(`StorageService.setLastSync(${key}): invalid param key.`);
    else
      this.items[key].lastsync = when ?? Date.now();
  }

  public setTimeout(key: string, timeout: any): void {
    if (this.items[key] == undefined) {
      console.error(`StorageService.setTimeout(${key}): invalid param key.`);
      return;
    }
    clearTimeout(this.items[key].timeout);
    this.items[key].timeout = timeout;
  }

}

export interface StorageItem {
  expectedVersion: number;
  lastsync: number;
  syncInterval: number;
  timeout: any;
  urlFragment: string;
  version: number;
}

const defaultStorageSettingsitems: { [key: string]: StorageItem } = {
  'comp': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: -1,
    timeout: null,
    urlFragment: '',
    version: 0,
  },
  'cases': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 180000,
    timeout: null,
    urlFragment: '/cases',
    version: 0,
  },
  'client': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 180000,
    timeout: null,
    urlFragment: '/client',
    version: 0,
  },
  'finance': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 180000,
    timeout: null,
    urlFragment: '/finance',
    version: 0,
  },
  'inf': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 30000,
    timeout: null,
    urlFragment: '',
    version: 1,
  },
  'notes': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 15000,
    timeout: null,
    urlFragment: '/notes',
    version: 0,
  },
  'notifications': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 15000,
    timeout: null,
    urlFragment: '/notifications',
    version: 0,
  },
  'parties': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 180000,
    timeout: null,
    urlFragment: '/parties',
    version: 0,
  },
  'tags': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 30000,
    timeout: null,
    urlFragment: '/tags',
    version: 0,
  },
  'user': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 180000,
    timeout: null,
    urlFragment: '/user/settings',
    version: 0,
  },
  'work': {
    expectedVersion: 1,
    lastsync: 0,
    syncInterval: 30000,
    timeout: null,
    urlFragment: '/work',
    version: 0,
  },
};