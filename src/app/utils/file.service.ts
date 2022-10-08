import { Injectable } from '@angular/core';
import { File, Page, Version } from 'src/app/if';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  displayable(version: Version|null|undefined) : boolean {
    if (!version || !version.ext)
      return false;
    return version.ext.displayable;
  }

  downloadable(version: Version|null|undefined) : boolean {
    if (!version || !version.ext)
      return false;
    return version.ext.downloadable;
  }

  page(file: File|null|undefined, n: number) : Page|null {
    let version = this.version(file);
    if (version && version.pages) {
      return version.pages[n];
    }
    return null;
  }

  pages(file: File|null|undefined) : Page[]|null {
    let version = this.version(file);
    if (version && version.pages) {
      return Object.values(version.pages);
    }
    return null;
  }

  version(file: File|null|undefined) : Version|null {
    if (!file)
      return null;
    if (Object.keys(file.versions).length > 0) {
      let key = +(Object.keys(file.versions)[Object.keys(file.versions).length-1]);
      return file.versions[key];
    }
    return null;
  }

}
