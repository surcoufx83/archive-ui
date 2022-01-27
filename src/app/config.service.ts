import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private appConfig: any;

  constructor(private http: HttpClient) {
	   this.http = http;
  }

  loadAppConfig() {
    return this.http.get('/assets/config/config.json')
      .toPromise()
      .then(config => {
        this.appConfig = config;
        console.log(config);
      });
  }

  get NavbarItems() : any[] {
    if (this.appConfig != undefined && this.appConfig.navbar !== undefined && this.appConfig.navbar.items !== undefined)
      return <any[]>this.appConfig.navbar.items;
    return [];
  }

  getIcon(iconName: string) : string {
    if (this.appConfig != undefined && this.appConfig.icons !== undefined && this.appConfig.icons[iconName] !== undefined)
      return <string>this.appConfig.icons[iconName];
    return 'fas fa-question';
  }

}
