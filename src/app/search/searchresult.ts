import { BankAccount, StandingOrder } from "../account/account";
import { Case } from "../cases/case";
import { Directory, File } from "../files/file";
import { Note } from "../notepad/note";

export interface SearchResults {
    accounts?: SearchResultAccountItem[];
    cases?: SearchResultCaseItem[];
    directories?: SearchResultDirectoryItem[];
    files?: SearchResultFileItem[];
    notes?: SearchResultNoteItem[];
    standingorders?: SearchResultStordItem[];
}

export interface SearchResultAccountItem {
    account: any;
    relevance: number;
}

export interface SearchResultCaseItem {
    case: any;
    relevance: number;
}

export interface SearchResultDirectoryItem {
    directory: any;
    relevance: number;
}

export interface SearchResultFileItem {
    file: any;
    relevance: number;
}

export interface SearchResultNoteItem {
    note: any;
    relevance: number;
}

export interface SearchResultStordItem {
    stord: any;
    relevance: number;
}
