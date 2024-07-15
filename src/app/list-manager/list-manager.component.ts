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
    initials: '',
    loginname: '',
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

  /**
   * Formats a given string URL.
   * @param inputStr The string to be formatted.
   * @returns The formatted URL string.
   */
  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  /**
   * Translates a given key using the i18n service.
   * @param key The key to translate.
   * @param params Additional parameters for translation.
   * @returns The translated string.
   */
  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  /**
     * Getter for i18n localization strings.
     * @returns The localization strings.
     */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Unsubscribes from all subscriptions to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Subscribes to settings and route changes to manage list updates and selected list.
   */
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

  /**
   * Loads the selected list based on the provided ID.
   * @param id The ID of the list to load.
   * @param toggleSidebar Whether to toggle the sidebar visibility.
   */
  ngOnInitLoadSelectedList(id: number, toggleSidebar: boolean): void {
    const templist = this.settingsService.getList(id);
    this.selectedList = templist ? { ...templist } : null;
    if (toggleSidebar && this.isMobile)
      this.sidebarOpen = false;
  }

  /**
   * Creates a new list based on the blankList template.
   * Navigates to the list edit page after creation.
   */
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

  /**
   * Deletes the currently selected list after confirmation.
   * Navigates back to the list overview page after deletion.
   */
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
