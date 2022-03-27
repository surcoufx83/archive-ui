import { Case } from "../cases/case";
import { Party } from "../common";

export interface BankAccount {
    id: number;
    accountno: string;
    bank: Party;
    bankid: number;
    bic: string;
    case: Case;
    caseid: number;
    client: Party;
    clientid: number;
    created: string;
    currency: Currency;
    currencyid: number;
    iban: string;
    title: string;
    updated: string;
}

export interface Currency {
    id: number;
    isdefault: boolean;
    name: string;
    shortname: string;
    sign: string;
}

export interface StandingOrder {
    
}
