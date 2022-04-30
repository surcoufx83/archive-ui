import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { Case } from '../cases/case';
import { AppConfig, ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  public cases$: BehaviorSubject<{ [key: number]: Case }> = new BehaviorSubject<{ [key: number]: Case }>({});
  private casesTime: number = 0;

  constructor(private authService: AuthService,
    private configService: ConfigService) {
    this.loadCases();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  loadCases() {
    if (!this.authService.isLoggedin) {
      setTimeout(() => { this.loadCases(); }, 10000);
      return;
    }
    let url: string = `${this.config.api.baseUrl}/cases` + (this.casesTime > 0 ? '/' + this.casesTime : '');
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['cases']) {
        let cases = <Case[]>reply.payload['cases'];
        if (cases.length > 0) {
          let cache = this.cases$.value;
          for (let i = 0; i < cases.length; i++) {
            cache[cases[i].id] = cases[i];
          }
          this.cases$.next(cache);
        }
        this.casesTime = +reply.payload['ts'];
      }
      setTimeout(() => {
        this.loadCases();
      }, 10000);
    });
  }

}
