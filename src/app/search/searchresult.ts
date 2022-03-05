import { BankAccount } from "../account/account";
import { Case } from "../cases/case";
import { Directory, File, Page } from "../files/file";
import { Note } from "../notepad/note";

export interface SearchResults {
    accounts?: SearchResultAccountItem[];
    cases?: SearchResultCaseItem[];
    directories?: SearchResultDirectoryItem[];
    files?: SearchResultFileItem[];
    notes?: SearchResultNoteItem[];
    pages?: SearchResultPageItem[];
}

export interface SearchResultAccountItem {
    account: BankAccount;
    relevance: number;
}

export interface SearchResultCaseItem {
    case: Case;
    relevance: number;
}

export interface SearchResultDirectoryItem {
    directory: Directory;
    relevance: number;
}

export interface SearchResultFileItem {
    file: File;
    relevance: number;
}

export interface SearchResultNoteItem {
    note: Note;
    relevance: number;
}

export interface SearchResultPageItem {
    file: File;
    page: Page;
    relevance: number;
}
