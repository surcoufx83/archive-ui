
export interface Case {
    id: number;
    casepath: string;
    childs: Case[];
    clientid: number|null;
    comment: string;
    created: string;
    deleted: string|null;
    directoryid: number|null;
    extid: string;
    files: File[];
    filescount: number;
    followupcaseid: number|null;
    issub: boolean;
    modified: string;
    notification: CaseNotification;
    parentid: number|null;
    partyid: number|null;
    period: CasePeriod;
    search1: string;
    search2: string;
    search3: string;
    statusid: number;
    taxyear: number|null;
    title: string;
    typeid: number
}

export interface CaseFiletype {
    icon: string;
    iconcolor: string;
    id: number;
    name: string;
    i18nname: string;
}

export interface CaseNotification {
    forecast: boolean;
    upcoming: boolean;
}

export interface CasePeriod {
    end: string|null;
    minperiod: Duration|null;
    minperiodFullfilled: boolean;
    period: Duration|null;
    renewal: CasePeriodRenewal;
    start: string|null;
    terminationperiod: Duration|null;
}

export interface CasePeriodRenewal {
    after: Duration|null;
    enabled: boolean;
    nextdate: string|null;
    period: Duration|null;
}

export interface CaseStatus {
    created: string;
    deleted: string|null;
    flag: string;
    flags: CaseStatusFlags;
    followup: CaseStatusFollowUp;
    icon: string;
    iconcolor: string;
    id: number;
    modified: string;
    name: string;
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

export interface CaseStatusFollowUp {
    status: number|null;
    autoswitch: boolean;
    period: Duration|null;
}

export interface CaseType {
    created: string;
    deleted: string|null;
    icon: string;
    id: number;
    modified: string;
    name: string;
}