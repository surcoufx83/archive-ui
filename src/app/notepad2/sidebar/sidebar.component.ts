import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import type { Note } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';

@Component({
  selector: 'app-notepad2-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges {

  @Input({ required: true }) isMobile!: boolean;
  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) notes!: Note[];

  deleteNote?: Note;
  deleteSaving: boolean = false;
  filteredNotes: Note[] = [];
  filterExpr: string = '';
  privateNoteId: number = 0;
  privateSaving: boolean = false;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) {
    this.i18nService.setTitle('notepad2.title');
  }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notes'])
      this.onChangeFilter();
  }

  onChangeFilter(): void {
    const expr = this.filterExpr.toLocaleLowerCase().trim();
    if (expr === '') {
      this.filteredNotes = [...this.notes];
      return;
    }
    this.filteredNotes = this.notes.filter((note) => note.title.toLocaleLowerCase().includes(expr) || note.content.toLocaleLowerCase().includes(expr));
  }

  onDeletionConfirmed(note: Note): void {
    if (this.deleteSaving || !this.deleteNote)
      return;
    this.deleteSaving = true;
    this.settingsService.deleteNote({ ...this.deleteNote }).pipe(first()).subscribe(() => {
      this.deleteNote = undefined;
      this.deleteSaving = false;
    });
  }

  onMarkPrivateBtnClicked(note: Note, $event: MouseEvent): void {
    if (this.privateSaving)
      return;
    this.privateSaving = true;
    this.privateNoteId = note.id;
    this.preventDefaultEvents($event);
    const newnote: Note = { ...note };
    newnote.private = !newnote.private;
    this.settingsService.updateNote(newnote).pipe(first()).subscribe(() => {
      this.privateNoteId = 0;
      this.privateSaving = false;
    });
  }

  onPinnedBtnClicked(note: Note, $event: MouseEvent): void {
    this.preventDefaultEvents($event);
    const newnote: Note = { ...note };
    newnote.pinned = !newnote.pinned;
    this.settingsService.updateNote(newnote).pipe(first()).subscribe();
  }

  preventDefaultEvents($event: MouseEvent): void {
    $event.stopImmediatePropagation();
    $event.stopPropagation();
    $event.preventDefault();
  }

}
