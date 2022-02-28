import { BankAccount, StandingOrder } from "../account/account";
import { Case } from "../cases/case";
import { Directory, File } from "../files/file";
import { Note } from "../notepad/note";

export interface SearchResults {
    bankaccount?: {[key: number]: BankAccount};
    bankstandingorder?: {[key: number]: StandingOrder};
    casesitem?: {[key: number]: Case};
    directoriesitem?: {[key: number]: Directory};
    filesitem?: {[key: number]: File};
    noteitem?: {[key: number]: Note};
}