import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Subscription } from 'rxjs';
import { I18nService } from '../i18n.service';
import type { Note } from '../if';
import { SettingsService } from '../utils/settings.service';

@Component({
  selector: 'app-notepad2',
  templateUrl: './notepad2.component.html',
  styleUrls: ['./notepad2.component.scss']
})
export class Notepad2Component implements OnDestroy, OnInit {

  notes: WritableSignal<Note[]> = signal([]);
  selectedNote: Note | null = null;
  editMode: boolean = false;

  subs: Subscription[] = [];

  constructor(
    private i18nService: I18nService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
  ) { }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.settingsService.notepadItems$.subscribe((newNotes) => {
      this.notes.set(Object.values(newNotes).sort((a, b) => `${a.pinned ? '0' : '9'}${a.title.toLocaleLowerCase()}`.localeCompare(`${b.pinned ? '0' : '9'}${b.title.toLocaleLowerCase()}`, undefined, { numeric: true })));
      if (this.selectedNote)
        this.ngOnInitLoadSelectedNote(this.selectedNote.id);
    }));
    this.subs.push(this.route.queryParamMap.subscribe((map) => {
      const tempid = map.get('id');
      if (tempid)
        this.ngOnInitLoadSelectedNote(+tempid);
      else
        this.selectedNote = null;
      this.editMode = map.has('editor');
    }));
  }

  ngOnInitLoadSelectedNote(id: number): void {
    const tempnote = this.settingsService.getNote(id);
    this.selectedNote = tempnote ? { ...tempnote } : null;
  }

}
