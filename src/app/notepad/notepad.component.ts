import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Note, UserSettings } from 'src/app/if';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss']
})
export class NotepadComponent implements OnInit {

  busy: boolean = false;
  debounceFilter: any;
  debounceSave: any;
  editId: number = -1;
  editNote?: Note;
  filterphrase: string = '';
  notes: Note[] = [];
  saving: boolean = false;
  sortasc: boolean = false;
  sortby: string = 'edit';
  usersettingsObj: UserSettings|null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
  }

  close() : void {
    this.editNote = undefined;
    this.editId = -1;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  delete(n: Note) : void {
    this.saving = true;
      let url = this.config.api.baseUrl + '/note/' + n.id + '/delete';
      this.authService.updateApi(url, { }).subscribe((reply) => {
        if (reply.success) {
          for(let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id == n.id) {
              this.notes.splice(i, 1);
              break;
            }
          }
        }
        this.saving = false;
      });
  }

  edit(n: Note) : void {
    if (this.editNote) {
      for(let i = 0; i < this.notes.length; i++) {
        if (this.notes[i].id == this.editNote.id) {
          this.notes[i] = this.editNote;
          this.save(this.notes[i]);
        }
      }
      this.close();
    }
    this.editNote = n;
    this.editId = n.id;
  }

  f(date: Date|string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  filter() : void {
    this.filterphrase = this.filterphrase.toLowerCase();
    if (this.filterphrase === '')
      this.notes.forEach(n => n.show = true);
    else
      this.notes.forEach(n => n.show = n.title.toLowerCase().includes(this.filterphrase) || n.content.toLowerCase().includes(this.filterphrase));
  }

  filterKeyup() : void {
    if (this.debounceFilter)
      clearTimeout(this.debounceFilter);
    this.debounceFilter = setTimeout(() => {
      this.filter();
    }, 250);
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  new() : void {
    this.notes = [
      {
        id: 0,
        title: '',
        content: '',
        variant: '',
        updated: (new Date()).toISOString(),
        deldate: null,
        show: true,
      }, ...this.notes
    ];
    this.edit(this.notes[0]);
  }

  ngOnInit(): void {
    this.update();
  }

  save(n: Note) : void {
    if (this.debounceSave)
      clearTimeout(this.debounceSave);
    this.debounceSave = setTimeout(() => {
      this.saving = true;
      let fragment = n.id === 0 ? 'create' : n.id;
      let url = `${this.config.api.baseUrl}/note/${fragment}`;
      this.authService.updateApi(url, {
        'note': n
      }).subscribe((reply) => {
        if (fragment === 'create') {
          this.notes.splice(0, 1);
          this.update();
        }
        this.saving = false;
      });
    }, 500);
  }

  sort(key: string, asc: boolean|null = null) : void {
    this.sortby = key;
    if (asc != null)
      this.sortasc = asc;
      switch (this.sortby) {
        case 'name':
          if (this.sortasc)
            this.notes = this.notes.sort((a, b) => { return a.title > b.title ? 1 : a.title < b.title ? -1 : 0 });
          else
            this.notes = this.notes.sort((a, b) => { return a.title > b.title ? -1 : a.title < b.title ? 1 : 0 });
          break;

        case 'edit':
          if (this.sortasc)
            this.notes = this.notes.sort((a, b) => { return a.updated > b.updated ? 1 : a.updated < b.updated ? -1 : 0 });
          else
            this.notes = this.notes.sort((a, b) => { return a.updated > b.updated ? -1 : a.updated < b.updated ? 1 : 0 });
          break;

      }
  }

  update() : void {
    this.busy = true;
    let url: string = this.config.api.baseUrl + '/notes';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['notes']) {
        this.notes = reply.payload['notes'];
        this.sort(this.sortby);
        this.filter();
      }
      console.log(this.notes);
      this.busy = false;
    });
  }

}
