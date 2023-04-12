import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { format, sub } from 'date-fns';
import { Note, UserSettings } from 'src/app/if';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss']
})
export class NotepadComponent implements OnInit {

  busy: boolean = false;
  debounceFilter: any;
  debounceSave: any;
  editItemFormgroup = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
  });
  editId: number = -1;
  editNote?: Note;
  filterphrase: string = '';
  notes: Note[] = [];
  sortedNotes: Note[] = [];
  saving: boolean = false;
  sortasc: boolean = false;
  sortby: string = 'edit';
  usersettingsObj: UserSettings | null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService,
    public viewportScroller: ViewportScroller) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.i18nService.setTitle('notepad.title');
  }

  close(): void {
    this.editNote = undefined;
    this.editId = -1;
    this.editItemFormgroup.patchValue({
      title: '',
      content: ''
    });
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  delete(n: Note): void {
    this.saving = true;
    let url = this.config.api.baseUrl + '/note/' + n.id + '/delete';
    this.authService.updateApi(url, {}).subscribe((reply) => {
      if (reply.success) {
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i].id == n.id) {
            this.notes.splice(i, 1);
            break;
          }
        }
      }
      this.saving = false;
    });
  }

  edit(n: Note): void {
    if (this.editNote) {
      for (let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].id == this.editNote.id) {
          this.notes[i] = this.editNote;
          this.saveAndClose();
        }
      }
    } else {
      this.editNote = { ...n };
      this.editId = this.editNote.id;
      this.editItemFormgroup.patchValue({
        title: this.editNote.title,
        content: this.editNote.content
      });
    }
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  filter(): void {
    this.filterphrase = this.filterphrase.toLowerCase();
    if (this.filterphrase === '')
      this.sortedNotes.forEach(n => n.show = true);
    else
      this.sortedNotes.forEach(n => n.show = n.title.toLowerCase().includes(this.filterphrase) || n.content.toLowerCase().includes(this.filterphrase));
  }

  filterKeyup(): void {
    if (this.debounceFilter)
      clearTimeout(this.debounceFilter);
    this.debounceFilter = setTimeout(() => {
      this.filter();
    }, 250);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.userSettings.notepadItems$.subscribe((notes) => {
      if (this.editId > -1)
        return;
      this.notes = Object.values(notes);
      this.notes = this.notes.sort((a, b) => { return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 0 })
      this.sortedNotes = [ ...this.notes ];
      this.sort(this.sortby);
      this.filter();
    });
  }

  new(): void {
    this.notes = [
      {
        id: 0,
        title: '',
        content: '',
        variant: '',
        updated: (new Date()).toISOString(),
        deldate: null,
        pinned: false,
        show: true,
      }, ...this.notes
    ];
    this.edit(this.notes[0]);
  }

  save(force: boolean = false, callback?: Function): void {
    if (this.debounceSave)
      clearTimeout(this.debounceSave);
    if (force)
      this.save2(callback);
    else
    this.debounceSave = setTimeout(() => this.save2(), 1000);
  }

  saveAndClose(): void {
    this.save(true, () => { this.close() });
  }

  private save2(callback?: Function) {
    if (!this.editNote || !this.editItemFormgroup.valid) {
      if (callback)
        callback();
      return;
    }
    if (this.editNote.title == this.editItemFormgroup.get('title')!.value && this.editNote.content == this.editItemFormgroup.get('content')!.value) {
      if (callback)
        callback();
      return;
    }
    this.saving = true;
    let newnote = { ...this.editNote };
    newnote.title = this.editItemFormgroup.get('title')!.value!;
    newnote.content = this.editItemFormgroup.get('content')!.value!;
    this.userSettings.updateNote(newnote).subscribe((subject) => {
      if (subject !== null) {
        this.saving = false;
        if (callback)
          callback();
      }
    });
  }

  sort(key: string, asc: boolean | null = null): void {
    this.sortby = key;
    if (asc != null)
      this.sortasc = asc;
    switch (this.sortby) {
      case 'name':
        if (this.sortasc)
          this.sortedNotes = this.sortedNotes.sort((a, b) => { return a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? 1 : a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase() ? -1 : 0 });
        else
          this.sortedNotes = this.sortedNotes.sort((a, b) => { return a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase() ? -1 : a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase() ? 1 : 0 });
        break;

      case 'edit':
        if (this.sortasc)
          this.sortedNotes = this.sortedNotes.sort((a, b) => { return a.updated > b.updated ? 1 : a.updated < b.updated ? -1 : 0 });
        else
          this.sortedNotes = this.sortedNotes.sort((a, b) => { return a.updated > b.updated ? -1 : a.updated < b.updated ? 1 : 0 });
        break;

    }
  }

}
