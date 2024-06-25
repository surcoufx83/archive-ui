import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { List } from '../if';
import { SettingsService } from '../utils/settings.service';

@Component({
  selector: 'app-list-manager',
  templateUrl: './list-manager.component.html',
  styleUrl: './list-manager.component.scss'
})
export class ListManagerComponent implements OnDestroy, OnInit {

  editMode: boolean = false;
  isMobile: boolean;
  lists: WritableSignal<List[]> = signal([]);
  selectedList: List | null = null;
  sidebarOpen: boolean;

  subs: Subscription[] = [];

  constructor(
    configService: ConfigService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
  ) {
    this.isMobile = configService.isMobile();
    this.sidebarOpen = true;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.settingsService.listItems$.subscribe((newLists) => {
      this.lists.set(Object.values(newLists).sort((a, b) => `${a.pinned ? '0' : '9'}${a.title.toLocaleLowerCase()}`.localeCompare(`${b.pinned ? '0' : '9'}${b.title.toLocaleLowerCase()}`, undefined, { numeric: true })));
      if (this.selectedList)
        this.ngOnInitLoadSelectedList(this.selectedList.id, false);
    }));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      const tempid = map.get('id');
      if (tempid)
        this.ngOnInitLoadSelectedList(+tempid, true);
      else
        this.selectedList = null;
      this.editMode = map.has('editor');
    }));
  }

  ngOnInitLoadSelectedList(id: number, toggleSidebar: boolean): void {
    const templist = this.settingsService.getList(id);
    this.selectedList = templist ? { ...templist } : null;
    if (toggleSidebar && this.isMobile)
      this.sidebarOpen = false;
  }

}
