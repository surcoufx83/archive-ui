import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import type { Note } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';

@Component({
  selector: 'app-notepad2-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges {

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

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
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
