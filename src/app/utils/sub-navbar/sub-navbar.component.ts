import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarItem } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.scss']
})
export class SubNavbarComponent implements OnInit, OnDestroy {

  @Input() navitems!: NavbarItem[];

  icons = environment.icons;
  private subscription?: Subscription;
  url: string = '';

  constructor(
    private i18nService: I18nService,
    private router: Router,
  ) {
    this.url = this.router.url;
  }

  i18n(key: string, params: any[] = [], i: number = 0): string {
    return this.i18nService.i18n(key, params, i);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.url = event.url;
    });
  }

}
