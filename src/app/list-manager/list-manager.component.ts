import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { List } from '../if';
import { L10nArchiveLocale } from '../l10n/l10n.types';
import { FormatService } from '../utils/format.service';
import { SettingsService } from '../utils/settings.service';

const blankList: List = {
  checkedBelow: true,
  deleted: null,
  description: '',
  id: 0,
  items: [],
  listStyle: 'cb',
  pinned: false,
  private: false,
  reset: null,
  title: '',
  updated: '',
  user: {
    id: 0,
    loginname: ''
  }
}

@Component({
  selector: 'app-list-manager',
  templateUrl: './list-manager.component.html',
  styleUrl: './list-manager.component.scss'
})
export class ListManagerComponent implements OnDestroy, OnInit {

  createSaving: boolean = false;
  deleteSaving: boolean = false;
  dragMode: boolean = false;
  editMode: boolean = false;
  icons = environment.icons;
  isMobile: boolean;
  lists: WritableSignal<List[]> = signal([]);
  selectedList: List | null = null;
  sidebarOpen: boolean;
  subs: Subscription[] = [];

  constructor(
    configService: ConfigService,
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.isMobile = configService.isMobile();
    this.sidebarOpen = true;
  }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
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
      this.editMode = map.has('editor') && map.get('editor') === 'true';
    }));
  }

  ngOnInitLoadSelectedList(id: number, toggleSidebar: boolean): void {
    const templist = this.settingsService.getList(id);
    this.selectedList = templist ? { ...templist } : null;
    if (toggleSidebar && this.isMobile)
      this.sidebarOpen = false;
  }

  onCreateList(): void {
    if (this.deleteSaving || this.createSaving)
      return;
    this.createSaving = true;
    this.settingsService.updateList({ ...blankList }).pipe(first()).subscribe((list) => {
      if (list === true || list === false)
        return;
      this.createSaving = false;
      this.router.navigate(['/lists'], { queryParams: { id: list.id, subject: this.furl(this.i18nstr.listManager.list.blankListTitle), editor: true } })
    });
  }

  onDeletionConfirmed(): void {
    if (this.deleteSaving || this.createSaving || !this.selectedList)
      return;
    this.deleteSaving = true;
    this.settingsService.deleteList({ ...this.selectedList }).pipe(first()).subscribe(() => {
      this.selectedList = null;
      this.deleteSaving = false;
      this.router.navigate(['/lists']);
      setTimeout(() => {
        if (this.isMobile)
          this.sidebarOpen = true;
      }, 5);
    });
  }

}
