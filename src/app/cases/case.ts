import { Client } from "../common";
import { Directory } from "../files/file";

export interface Case {
    id: number;
    casepath: string;
    client: Client|null;
    clientid: number|null;
    comment: string;
    directory: Directory|null;
    directoryid: number|null;
    extid: string;
    files: File[];
    followupcase: Case|null;
    followupcaseid: number|null;
    issub: boolean;
    search1: string;
    search2: string;
    search3: string;
    notification: CaseNotification;
    parent: Case|null;
    parentid: number|null;
    party: Client|null;
    partyid: number|null;
    period: any;
    status: CaseStatus;
    statusid: number;
    title: string;
    type: CaseType;
    typeid: number
}

export interface CaseFiletype {
    
}

export interface CaseNotification {
    forecast: boolean;
    upcoming: boolean;
}

export interface CaseStatus {
}

export interface CaseType {
}