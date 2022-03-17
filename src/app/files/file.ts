import { Case, CaseFiletype } from "../cases/case";
import { Address, Party, PartyContact } from "../common";
import { Class } from "./class";

export interface Directory {
    id: number;
    parent: Directory|null;
    parentid: number|null;
    name: string;
    relpath: string;
    isroot: boolean;
    islink: boolean;
    mtime: string;
    deldate: string|null;
}

export interface Extension {
    id: number;
    displayable: boolean;
    downloadable: boolean;
    ext: string;
    indexable: boolean;
    mimetype: string;
}

export interface File {
    id: number;
    directory: Directory|null;
    directoryid: number|null;
    class: Class|null;
    classid: number|null;
    case: Case|null;
    caseid: number|null;
    case_filetype: CaseFiletype|null;
    case_filetypeid: number|null;
    client: Party|null;
    clientid: number|null;
    fileexists: boolean;
    partyaddress: Address|null;
    partyaddressid: number|null;
    contact: PartyContact|null;
    contactid: number|null;
    name: string;
    islink: boolean;
    mtime: string;
    size: number;
    hash: string;
    deldate: string|null;
    case_filename: string|null;
    case_filedescription: string|null;
    case_filestatus: string|null;
    case_pintop: boolean;
    fileclass_meta: any;
    relpath: string;
    attributes: any;
    versions: { [key: number]: Version };
}

export interface Page {
    id: number;
    versionid: number;
    pageno: number;
    pagetype: number;
    pagedata: string;
}

export interface Version {
    id: number;
    fileid: number;
    num: number;
    created: string;
    indexed: string|null;
    hasocr: boolean;
    ext: Extension|null;
    extid: number|null;
    pages: Page[];
    words: any[];
    stats: VersionStats;
}

export interface VersionStats {
    wordcount: number;
    votedWordcount: number;
}