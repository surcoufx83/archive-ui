import { Component, Input } from '@angular/core';
import { saveAs } from 'file-saver-es';
import { first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { File, Version } from 'src/app/if';
import { FileService } from 'src/app/utils/file.service';
import { FormatService } from 'src/app/utils/format.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'file-list-item',
  templateUrl: './file-list-item.component.html',
  styleUrls: ['./file-list-item.component.scss']
})
export class FileListItemComponent {

  @Input({ required: true }) file!: File;
  @Input() gotoButton: boolean = false;
  @Input() relevance: number | null = null;
  @Input({ required: true }) routeSelf!: string[];
  @Input() showButtons: boolean = true;

  icons = environment.icons;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    public formatService: FormatService,
    private fileService: FileService,
  ) { }

  download(): void {
    if (this.file == null)
      return;
    this.authService.download(this.fileurl).pipe(first()).subscribe(blob => saveAs(blob, this.file.name));
  }

  get fileurl(): string {
    return `${environment.api.baseUrl}/file/${this.file?.id}/download`;
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  get version(): Version | null {
    return this.fileService.version(this.file);
  }

}
