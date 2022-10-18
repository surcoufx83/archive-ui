import { BankAccount, Case, Directory, File, Note, Page, Version } from "src/app/if";

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
    version: Version;
    relevance: number;
}

export interface SearchResultNoteItem {
    note: Note;
    relevance: number;
}

export interface SearchResultPageItem {
    file: File;
    page: Page;
    version: Version;
    relevance: number;
}
