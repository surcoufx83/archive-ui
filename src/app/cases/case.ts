import { Party } from "../common";
import { Directory } from "../files/file";

export interface Case {
    id: number;
    casepath: string;
    client: Party|null;
    clientid: number|null;
    comment: string;
    directory: Directory|null;
    directoryid: number|null;
    extid: string;
    files: File[];
    followupcase: Case|null;
    followupcaseid: number|null;
    issub: boolean;
    notification: CaseNotification;
    parent: Case|null;
    parentid: number|null;
    party: Party|null;
    partyid: number|null;
    period: CasePeriod;
    search1: string;
    search2: string;
    search3: string;
    status: CaseStatus;
    statusid: number;
    title: string;
    type: CaseType;
    typeid: number
}

export interface CaseFiletype {
    icon: string;
    iconcolor: string;
    id: number;
    name: string;
}

export interface CaseNotification {
    forecast: boolean;
    upcoming: boolean;
}

export interface CasePeriod {
    end: string;
    minperiod: Duration;
    minperiodFullfilled: boolean;
    period: Duration;
    renewal: CasePeriodRenewal;
    start: string;
    terminationperiod: Duration;
}

export interface CasePeriodRenewal {
    after: Duration;
    enabled: boolean;
    nextdate: string|null;
    period: Duration;
}

export interface CaseStatus {
    flag: string;
    flags: CaseStatusFlags;
    icon: string;
    iconcolor: string;
    id: number;
    name: string;
    nextstatus?: CaseStatus;
}

export interface CaseStatusFlags {
    active: boolean;
    cancelled: boolean;
    created: boolean;
    deleted: boolean;
    deletion: boolean;
    expired: boolean;
    hidden: boolean;
}

export interface CaseType {
    icon: string;
    id: number;
    name: string;
}