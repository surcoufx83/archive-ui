import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { List } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';

@Component({
  selector: 'app-list-manager-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class ListManagerSidebarComponent implements OnChanges {

  @Input({ required: true }) isMobile!: boolean;
  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) lists!: List[];

  deleteList?: List;
  deleteSaving: boolean = false;
  filteredLists: List[] = [];
  filterExpr: string = '';
  privateListId: number = 0;
  privateSaving: boolean = false;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) {
    this.i18nService.setTitle('listManager.title');
  }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lists'])
      this.onChangeFilter();
  }

  onChangeFilter(): void {
    const expr = this.filterExpr.toLocaleLowerCase().trim();
    if (expr === '') {
      this.filteredLists = [...this.lists];
      return;
    }
    this.filteredLists = this.lists.filter((list) => list.title.toLocaleLowerCase().includes(expr) || list.description.toLocaleLowerCase().includes(expr));
  }

  onDeletionConfirmed(note: List): void {
    if (this.deleteSaving || !this.deleteList)
      return;
    this.deleteSaving = true;
    this.settingsService.deleteList({ ...this.deleteList }).pipe(first()).subscribe(() => {
      this.deleteList = undefined;
      this.deleteSaving = false;
    });
  }

  onMarkPrivateBtnClicked(note: List, $event: MouseEvent): void {
    if (this.privateSaving)
      return;
    this.privateSaving = true;
    this.privateListId = note.id;
    this.preventDefaultEvents($event);
    const newnote: List = { ...note };
    newnote.private = !newnote.private;
    this.settingsService.updateList(newnote).pipe(first()).subscribe(() => {
      this.privateListId = 0;
      this.privateSaving = false;
    });
  }

  onPinnedBtnClicked(note: List, $event: MouseEvent): void {
    this.preventDefaultEvents($event);
    const newnote: List = { ...note };
    newnote.pinned = !newnote.pinned;
    this.settingsService.updateList(newnote).pipe(first()).subscribe();
  }

  preventDefaultEvents($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    $event.stopPropagation();
    $event.preventDefault();
  }

}
