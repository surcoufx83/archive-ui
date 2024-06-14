import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserSettings } from 'src/app/if';
import { NavbarItem } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../utils/settings.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnDestroy, OnInit {

  navitems: NavbarItem[] = [
    {
      title: "navbar.workitems.today",
      icon: "today",
      link: "/work/today",
      matchLink: "/work/day"
    },
    {
      title: "navbar.workitems.month",
      icon: "calendar",
      link: "/work/month",
      matchLink: "/work/month"
    },
    {
      title: "navbar.workitems.year",
      icon: "year",
      link: "/work/year",
      matchLink: "/work/year"
    },
    {
      title: "navbar.workitems.leads",
      icon: "leads",
      link: "/work/leads"
    },
    {
      title: "navbar.workitems.settings",
      icon: "settings",
      link: "/work/settings"
    }
  ];
  settingsObj: UserSettings | null = null;
  subscriptions: Subscription[] = [];

  constructor(
    private i18nService: I18nService,
    private settings: SettingsService
  ) {
    this.i18nService.setTitle('work.pagetitle');
  }

  i18n(key: string): string {
    return this.i18nService.i18n(key);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.settings.settings$.subscribe((settings) => {
      this.settingsObj = settings;
    }));
  }

}
