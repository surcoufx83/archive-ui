import type { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Component, Input } from '@angular/core';
import { first } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import type { Note } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';

@Component({
  selector: 'app-notepad2-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnChanges, OnDestroy, OnInit {

  @Input({ required: true }) note!: Note;
  @Input({ required: true }) editMode!: boolean;

  editableNote?: Note;
  editableContent: string = '';
  editorCurrentLine: string = '';
  editorCurrentLineProps: LineProperties = { match: '', level: -1, ol: false, olValue: -1, ul: false };
  ignoreKeys = [
    'CapsLock', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight',
    'AltLeft', 'AltRight', 'ContextMenu', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8',
    'F9', 'F10', 'F11', 'F12', 'AltGraph', 'ScrollLock', 'Pause', 'Insert'];
  bracketsKeys = ['[', '(', '{', '<', '`'];
  previewContent: string = '';
  saving: boolean = false;
  skipEnter: boolean = false;

  constructor(
    private formatService: FormatService,
    private i18nService: I18nService,
    private settingsService: SettingsService,
  ) { }

  cancel(e: KeyboardEvent): void {
    e.preventDefault();
  }

  fdate(date: Date | string | null, form: string): string {
    return this.formatService.fdate(date, form);
  }

  fdist(date: Date | string | null, suffix: boolean | undefined = undefined): string {
    return this.formatService.fdist(date, suffix);
  }

  furl(inputStr: string): string {
    return this.formatService.furl(inputStr);
  }

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

  getLineProperties(line: string): LineProperties {
    let out: LineProperties = { match: '', level: -1, ol: false, olValue: -1, ul: false };
    const olmatch = line.match(LineOlPattern);
    const ulmatch = line.match(LineUlPattern);
    if (olmatch !== null) {
      out.ol = true;
      out.match = olmatch.groups!['ls'];
      out.level = olmatch.groups!['level'] ? Math.floor(olmatch.groups!['level'].length / 3) : 0;
      out.olValue = +(olmatch.groups!['num']);
    }
    if (ulmatch !== null) {
      out.ul = true;
      out.match = ulmatch.groups!['ls'];
      out.level = ulmatch.groups!['level'] ? Math.floor(ulmatch.groups!['level'].length / 2) : 0;
    }
    return out;
  }

  handleNewLine(editor: HTMLTextAreaElement, lineBeforeLb: LineProperties): void {
    if (this.skipEnter) {
      this.skipEnter = false;
      return;
    }
    if (!lineBeforeLb.ol && !lineBeforeLb.ul)
      return;
    if (lineBeforeLb.ul) {
      editor.setRangeText(lineBeforeLb.match)
      editor.selectionStart += lineBeforeLb.match.length;
      this.editableContent = editor.value;
    }
    else if (lineBeforeLb.ol) {
      editor.setRangeText(lineBeforeLb.match.replace(`${lineBeforeLb.olValue!}.`, `${lineBeforeLb.olValue! + 1}.`))
      editor.selectionStart += lineBeforeLb.match.length;
      this.editableContent = editor.value;
    }
    this.setCurrentLine(editor);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['note'])
      return;
    if (!this.editableNote || changes['note'].firstChange || changes['note'].currentValue.id != changes['note'].previousValue.id) {
      // Other note selected by user, modify current note.
      this.editableNote = { ...this.note };
      this.editableContent = `${this.editableNote.content}`;
      this.previewContent = `${this.editableNote.content}`;
    }
    else if (this.editableNote && changes['note'].currentValue.id === changes['note'].previousValue.id) {
      // If note already loaded, update metadata only, not title and content as this will break current editing.
      this.editableNote.deldate = this.note.deldate;
      this.editableNote.pinned = this.note.pinned;
      this.editableNote.private = this.note.private;
      this.editableNote.show = this.note.show;
      this.editableNote.updated = this.note.updated;
      this.editableNote.variant = this.note.variant;
    }
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.editableNote = { ...this.note };
  }

  onKeyDown(e: KeyboardEvent, editor: HTMLTextAreaElement): void {
    /**
     * Tab key would level input field -> cancel to prevent loosing focus
     * Bracket keys are cancelled as they are handled in `onKeyUp` where char is added to editor if required
     */
    if (e.key == 'Tab' || this.bracketsKeys.includes(e.key))
      this.cancel(e);

    // If Enter key is pressed but the line only contains list without any content, this content is removed. The skipEnter causes the handleNewLine() method to not create a new list item.
    if (e.key == 'Enter' && (this.editorCurrentLineProps.ol || this.editorCurrentLineProps.ul) && this.editorCurrentLine == this.editorCurrentLineProps.match) {
      editor.selectionStart -= this.editorCurrentLineProps.match.length;
      editor.selectionEnd = editor.selectionStart + this.editorCurrentLineProps.match.length;
      editor.setRangeText('');
      this.skipEnter = true;
    }
  }

  debounceOnKeyUp: any;
  onKeyUp(e: KeyboardEvent | null, editor: HTMLTextAreaElement): void {
    if (!this.editableNote || this.ignoreKeys.includes(e?.key || ''))
      return;
    if (e?.key == 'Tab') {
      this.cancel(e);
      return;
    }
    const oldline = { ...this.editorCurrentLineProps };
    this.setCurrentLine(editor);
    if (e) {
      if (e.key == 'Enter')
        this.handleNewLine(editor, oldline);
      else if (this.bracketsKeys.includes(e.key)) {
        this.onPressBracketKey(editor, <'[' | '(' | '{' | '<' | '`'>e.key);
      }
    }
    clearTimeout(this.debounceOnKeyUp);
    this.debounceOnKeyUp = setTimeout(() => {
      if (!this.editableNote)
        return;
      this.saving = true;
      this.editableNote.content = `${this.editableContent}`;
      this.settingsService.updateNote(this.editableNote).pipe(first()).subscribe((newnote) => {
        if (newnote !== true && newnote !== false)
          setTimeout(() => {
            if (this.editableNote)
              this.editableNote.updated = newnote.updated;
          }, 50);
        this.saving = false;
      });
    }, 500);
    this.previewContent = `${this.editableContent}`;
  }

  onKeyUpTitle(): void {
    clearTimeout(this.debounceOnKeyUp);
    this.debounceOnKeyUp = setTimeout(() => {
      if (!this.editableNote)
        return;
      this.saving = true;
      this.settingsService.updateNote(this.editableNote).pipe(first()).subscribe((newnote) => {
        if (newnote !== true && newnote !== false)
          setTimeout(() => {
            if (this.editableNote)
              this.editableNote.updated = newnote.updated;
          }, 50);
        this.saving = false;
      });
    }, 500);
  }

  onMouseClick(e: MouseEvent, editor: HTMLTextAreaElement): void {
    this.setCurrentLine(editor);
  }

  onPressBracketKey(editor: HTMLTextAreaElement, key: '[' | '(' | '{' | '<' | '`') {
    editor.focus();
    this.setCurrentLine(editor);
    let selectionStart = editor.selectionStart;
    let selectionEnd = editor.selectionEnd;
    let selection = selectionEnd > selectionStart ? editor.value.substring(selectionStart, selectionEnd) : '';
    if (key != '`' || selection != '')
      editor.setRangeText(`${key}${selection.trim()}${key == '(' ? ')' : key == '<' ? '>' : key == '[' ? ']' : key == '{' ? '}' : '`'}${key == '[' ? '(https://your-url.com)' : ''}${selection.endsWith(' ') ? ' ' : ''}`);
    else
      editor.setRangeText('`');
    if (selectionStart === selectionEnd)
      editor.selectionStart += key != '`' ? 2 : 1;
    else if (key == '[') {
      editor.selectionStart += 3 + selection.trim().length;
      editor.selectionEnd -= selection.endsWith(' ') ? 2 : 1;
    }
    this.onPressCommon(editor);
  }

  onPressCommon(editor: HTMLTextAreaElement, selectionStart?: number, selectionEnd?: number): void {
    if (selectionStart)
      editor.selectionStart = selectionStart;
    if (selectionEnd)
      editor.selectionEnd = selectionEnd;
    this.setCurrentLine(editor);
    this.editableContent = editor.value;
    this.onKeyUp(null, editor);
  }

  onPressLevelChange(editor: HTMLTextAreaElement, type: '+' | '-'): void {
    editor.focus();
    this.setCurrentLine(editor);
    let selectionStart = editor.selectionStart;
    let selectionEnd = editor.selectionEnd;
    if (!this.editorCurrentLineProps.ol && !this.editorCurrentLineProps.ul)
      return;
    if (type == '-' && this.editorCurrentLineProps.level == 0)
      return;
    if (type == '+') {
      editor.value = this.editableContent.replace(this.editorCurrentLine, this.editorCurrentLineProps.ol ? `   ${this.editorCurrentLine}` : `  ${this.editorCurrentLine}`);
      selectionStart += this.editorCurrentLineProps.ol ? 3 : 2;
      selectionEnd += this.editorCurrentLineProps.ol ? 3 : 2;
    }
    else {
      editor.value = this.editableContent.replace(this.editorCurrentLine, this.editorCurrentLine.substring(this.editorCurrentLineProps.ol ? 3 : 2));
      selectionStart -= this.editorCurrentLineProps.ol ? 3 : 2;
      selectionEnd -= this.editorCurrentLineProps.ol ? 3 : 2;
    }
    this.onPressCommon(editor, selectionStart, selectionEnd);
  }

  formatters: { [key: string]: string } = {
    'bold': '**',
    'italic': '*',
    'strikethrough': '~~',
  }
  onPressFormatter(editor: HTMLTextAreaElement, type: 'bold' | 'italic' | 'strikethrough'): void {
    editor.focus();
    this.setCurrentLine(editor);
    let selectionStart = editor.selectionStart;
    let selectionEnd = editor.selectionEnd;
    let selection = selectionEnd > selectionStart ? editor.value.substring(selectionStart, selectionEnd) : '';
    editor.setRangeText(` ${this.formatters[type]}${selection.trim()}${this.formatters[type]} `);
    if (selectionStart === selectionEnd)
      editor.selectionStart += this.formatters[type].length + 1;
    this.onPressCommon(editor);
  }

  onPressList(editor: HTMLTextAreaElement, type: 'ol' | 'ul'): void {
    editor.focus();
    this.setCurrentLine(editor);
    let selectionStart = editor.selectionStart;
    let selectionEnd = editor.selectionEnd;
    if ((type == 'ol' && this.editorCurrentLineProps.ol) || (type == 'ul' && this.editorCurrentLineProps.ul)) {
      const match = this.editorCurrentLine.match(type == 'ol' ? LineOlPattern : LineUlPattern);
      if (!match || !match.groups || !match.groups['ls'])
        return;
      editor.value = this.editableContent.replace(this.editorCurrentLine, this.editorCurrentLine.substring(match.groups['ls'].length));
      selectionStart -= match.groups['ls'].length;
      selectionEnd -= match.groups['ls'].length;
    }
    else if (type == 'ol') {
      if (this.editorCurrentLineProps.ul)
        this.onPressList(editor, 'ul');
      editor.value = this.editableContent.replace(this.editorCurrentLine, `1. ${this.editorCurrentLine}`);
      selectionStart += 3;
      selectionEnd += 3;
    }
    else if (type == 'ul') {
      if (this.editorCurrentLineProps.ol)
        this.onPressList(editor, 'ol');
      editor.value = this.editableContent.replace(this.editorCurrentLine, `- ${this.editorCurrentLine}`);
      selectionStart += 2;
      selectionEnd += 2;
    }
    this.onPressCommon(editor, selectionStart, selectionEnd);
  }

  setCurrentLine(editor: HTMLTextAreaElement): void {
    const lines = editor.value.split('\n');
    let cursor = editor.selectionStart;
    let line = '';
    for (let i = 0; i < lines.length; i++) {
      if (cursor < lines[i].length + 1) {
        line = lines[i];
        break;
      }
      cursor -= (lines[i].length + 1);
    }
    this.editorCurrentLine = line;
    this.editorCurrentLineProps = this.getLineProperties(line);
  }

}

export type LineProperties = {
  level: number,
  ol: boolean,
  olValue?: number,
  ul: boolean,
  match: string,
}

export const LineOlPattern = /^(?<ls>(?<level>\s{3,8})*(?<num>\d+)\.\s+)/;
export const LineUlPattern = /^(?<ls>(?<level>\s{2,8})*\-\s+)/;
