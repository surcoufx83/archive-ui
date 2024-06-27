import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, type Subscription } from 'rxjs';
import { ConfigService } from 'src/app/config.service';
import { I18nService } from '../i18n.service';
import type { Note } from '../if';
import { SettingsService } from '../utils/settings.service';
import { FormatService } from '../utils/format.service';
import { environment } from 'src/environments/environment.dev';
import { formatISO } from 'date-fns';
import { L10nArchiveLocale } from '../l10n/l10n.types';

const blankNote: Note = {
  id: 0,
  content: '',
  deldate: null,
  pinned: false,
  private: false,
  show: true,
  title: '',
  updated: formatISO(new Date()),
  variant: ''
};

@Component({
  selector: 'app-notepad2',
  templateUrl: './notepad2.component.html',
  styleUrls: ['./notepad2.component.scss']
})
export class Notepad2Component implements OnDestroy, OnInit {

  createSaving: boolean = false;
  deleteSaving: boolean = false;
  editMode: boolean = false;
  icons = environment.icons;
  isMobile: boolean;
  notes: WritableSignal<Note[]> = signal([]);
  selectedNote: Note | null = null;
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
    this.subs.push(this.settingsService.notepadItems$.subscribe((newNotes) => {
      this.notes.set(Object.values(newNotes).sort((a, b) => `${a.pinned ? '0' : '9'}${a.title.toLocaleLowerCase()}`.localeCompare(`${b.pinned ? '0' : '9'}${b.title.toLocaleLowerCase()}`, undefined, { numeric: true })));
      if (this.selectedNote)
        this.ngOnInitLoadSelectedNote(this.selectedNote.id, false);
    }));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      const tempid = map.get('id');
      if (tempid)
        this.ngOnInitLoadSelectedNote(+tempid, true);
      else
        this.selectedNote = null;
      this.editMode = map.has('editor') && map.get('editor') === 'true';
    }));
  }

  ngOnInitLoadSelectedNote(id: number, toggleSidebar: boolean): void {
    const tempnote = this.settingsService.getNote(id);
    this.selectedNote = tempnote ? { ...tempnote } : null;
    if (toggleSidebar && this.isMobile)
      this.sidebarOpen = false;
  }

  onCreateNote(): void {
    if (this.deleteSaving || this.createSaving)
      return;
    this.createSaving = true;
    this.settingsService.updateNote({ ...blankNote }).pipe(first()).subscribe((note) => {
      if (note === true || note === false)
        return;
      this.router.navigate(['/notepad'], { queryParams: { id: note.id, subject: this.furl(this.i18nstr.notepad2.blankNoteTitle), editor: true } })
    });
  }

  onDeletionConfirmed(): void {
    if (this.deleteSaving || this.createSaving || !this.selectedNote)
      return;
    this.deleteSaving = true;
    this.settingsService.deleteNote({ ...this.selectedNote }).pipe(first()).subscribe(() => {
      this.selectedNote = null;
      this.deleteSaving = false;
      this.router.navigate(['/notepad']);
      setTimeout(() => {
        if (this.isMobile)
          this.sidebarOpen = true;
      }, 5);
    });
  }

}
