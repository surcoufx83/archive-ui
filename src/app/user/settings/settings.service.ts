import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from './settings';
import { AuthService } from '../../auth.service';
import { AppConfig, ConfigService } from '../../config.service';
import { WorkProperties } from '../../work/work';
import { User } from '../user';
import { Case, CaseFiletype, CaseStatus, CaseType } from 'src/app/cases/case';
import { Class } from 'src/app/files/class';
import { Address, ContactType, Country, Party, PartyContact, PartyRole } from 'src/app/common';
import { Currency } from 'src/app/account/account';
import { ToastsService } from 'src/app/utils/toasts.service';

@Injectable()
export class SettingsService {

  private archiveLoaded: boolean = false;
  private componentRefresher: any;

  private casesstorage: string = this.config.storage.prefix + 'casesData';
  private casessync: number = 0;

  constructor(private authService: AuthService,
    private configService: ConfigService) {
    this.loadCasesData();
    this.loadUserSettings();
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  private loadCasesData(): void {
    let olddata: string | null | CasesStorage = localStorage.getItem(this.casesstorage);
    if (olddata) {
      olddata = <CasesStorage>JSON.parse(olddata);
      this.cases.next(olddata.cases);
      this.casechilds.next(olddata.casechilds);
      this.caseroots.next(olddata.rootcases);
      this.caseStatus.next(olddata.casestatus);
      this.caseTypes.next(olddata.casetypes);
      this.casessync = olddata.ts;
    }
    this.syncCases();
  }

  public loadArchiveSettings(): void {
    if (this.archiveLoaded)
      return;
    this.archiveLoaded = true;
    let url = this.configService.config.api.baseUrl + '/common/props';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        this.updateAddresses(reply.payload['addresses']);
        this.updateClasses(reply.payload['classes']);
        this.updateClients(reply.payload['clients']);
        this.updateContacts(reply.payload['contacts']);
        this.updateContactTypes(reply.payload['contacttypes']);
        this.updateCountries(reply.payload['countries']);
        this.updateCurrencies(reply.payload['currencies']);
        this.updateFiletypes(reply.payload['casefiletypes']);
        this.updateParties(reply.payload['parties']);
        this.updateRoles(reply.payload['roles']);
      }
    });
    this.caseFileStatus.next(['new', 'checked', 'approved']);
  }

  private loadUserSettings(): void {
    let url = this.configService.config.api.baseUrl + '/user/settings';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        this.updateUser(<User>reply.payload['user']);
        this.updateWorkProps(<WorkProperties>reply.payload['work']);
      }
    });
  }

  public setTimeout(timeout: any): void {
    if (this.componentRefresher)
      clearTimeout(this.componentRefresher);
    this.componentRefresher = timeout;
  }

  private addresses: BehaviorSubject<Address[]> = new BehaviorSubject<Address[]>([]);
  addresses$ = this.addresses.asObservable();

  private cases: BehaviorSubject<{ [key: number]: Case }> = new BehaviorSubject<{ [key: number]: Case }>({});
  cases$ = this.cases.asObservable();

  private casechilds: BehaviorSubject<{ [key: number]: number[] }> = new BehaviorSubject<{ [key: number]: number[] }>({});
  casechilds$ = this.casechilds.asObservable();

  private caseroots: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  caseroots$ = this.caseroots.asObservable();

  private caseFileStatus: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  caseFileStatus$ = this.caseFileStatus.asObservable();

  private caseStatus: BehaviorSubject<{ [key: number]: CaseStatus }> = new BehaviorSubject<{ [key: number]: CaseStatus }>({});
  caseStatus$ = this.caseStatus.asObservable();

  getCaseStatus(id: number | null): CaseStatus | null {
    if (id == null)
      return null;
    if (this.caseStatus.value[id])
      return this.caseStatus.value[id];
    return null;
  }

  private caseTypes: BehaviorSubject<{ [key: number]: CaseType }> = new BehaviorSubject<{ [key: number]: CaseType }>({});
  caseTypes$ = this.caseTypes.asObservable();

  getCaseType(id: number | null): CaseType | null {
    if (id == null)
      return null;
    if (this.caseTypes.value[id])
      return this.caseTypes.value[id];
    return null;
  }

  private classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);
  classes$ = this.classes.asObservable();

  private clients: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]);
  clients$ = this.clients.asObservable();

  private contacts: BehaviorSubject<PartyContact[]> = new BehaviorSubject<PartyContact[]>([]);
  contacts$ = this.contacts.asObservable();

  private contacttypes: BehaviorSubject<ContactType[]> = new BehaviorSubject<ContactType[]>([]);
  contacttypes$ = this.contacttypes.asObservable();

  private countries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);
  countries$ = this.countries.asObservable();

  private currencies: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);
  currencies$ = this.currencies.asObservable();

  private filetypes: BehaviorSubject<CaseFiletype[]> = new BehaviorSubject<CaseFiletype[]>([]);
  filetypes$ = this.filetypes.asObservable();

  private parties: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]);
  parties$ = this.parties.asObservable();

  private roles: BehaviorSubject<PartyRole[]> = new BehaviorSubject<PartyRole[]>([]);
  roles$ = this.roles.asObservable();

  private settings: BehaviorSubject<Settings | null> = new BehaviorSubject<Settings | null>(null);
  settings$ = this.settings.asObservable();

  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  private workprops: BehaviorSubject<WorkProperties | null> = new BehaviorSubject<WorkProperties | null>(null);
  workprops$ = this.workprops.asObservable();

  private postCommon(method: string, item: any, urlitem: string, listing: any[], subject: BehaviorSubject<boolean | any | null>,
    callback: Function) {

    let url = this.configService.config.api.baseUrl + '/' + urlitem + '/';
    if (method == 'create')
      url += 'create';
    else
      url += item.id + (method == 'delete' ? '/delete' : '');
    let obj: { [key: string]: any } = {};
    if (method != 'delete')
      obj[urlitem] = item;
    this.authService.updateApi(url, obj).subscribe((reply) => {
      if (reply.success) {
        let newitem = null;
        if (method != 'delete' && reply.payload)
          newitem = reply.payload[urlitem];
        if (item.id > 0) {
          let removei = -1;
          for (let i = 0; i < listing.length; i++) {
            if (listing[i].id == item.id) {
              removei = i;
              break;
            }
          }
          if (removei > -1) {
            if (method == 'delete')
              listing.splice(removei, 1);
            else
              listing.splice(removei, 1, newitem);
          }
        }
        else
          listing.push(newitem);

        subject.next(method != 'delete' ? newitem : true);
        subject.complete();
        callback(listing);
      }
      else {
        subject.next(false);
        subject.complete();
      }
    });

  }

  private postObject(method: string, item: any, urlitem: string, subject: BehaviorSubject<boolean | any | null>,
    callback: Function) {
    let url = this.configService.config.api.baseUrl + '/' + urlitem + '/';
    if (method == 'create')
      url += 'create';
    else
      url += item.id + (method == 'delete' ? '/delete' : '');
    let obj: { [key: string]: any } = {};
    if (method != 'delete')
      obj[urlitem] = item;
    this.authService.updateApi(url, obj).subscribe((reply) => {
      if (reply.success) {
        let newitem = null;
        if (reply.payload) {
          newitem = reply.payload[urlitem];
        }
        subject.next(method != 'delete' ? newitem : true);
        subject.complete();
        callback([newitem]);
      }
      else {
        subject.next(false);
        subject.complete();
      }
    });

  }

  deleteClass(classitem: Class): BehaviorSubject<boolean | null> {
    let subject = new BehaviorSubject<boolean | null>(null);
    this.postCommon('delete', classitem, 'class', this.classes.value, subject, (c: Class[]) => this.updateClasses(c));
    return subject;
  }

  deleteContactType(ctypeitem: ContactType): BehaviorSubject<boolean | null> {
    let subject = new BehaviorSubject<boolean | null>(null);
    this.postCommon('delete', ctypeitem, 'contacttype', this.contacttypes.value, subject, (c: ContactType[]) => this.updateContactTypes(c));
    return subject;
  }

  deleteCountry(countryitem: Country): BehaviorSubject<boolean | null> {
    let subject = new BehaviorSubject<boolean | null>(null);
    this.postCommon('delete', countryitem, 'country', this.countries.value, subject, (c: Country[]) => this.updateCountries(c));
    return subject;
  }

  deleteCurrency(currencyitem: Currency): BehaviorSubject<boolean | null> {
    let subject = new BehaviorSubject<boolean | null>(null);
    this.postCommon('delete', currencyitem, 'currency', this.currencies.value, subject, (c: Currency[]) => this.updateCurrencies(c));
    return subject;
  }

  deleteRole(roleitem: PartyRole): BehaviorSubject<boolean | null> {
    let subject = new BehaviorSubject<boolean | null>(null);
    this.postCommon('delete', roleitem, 'role', this.roles.value, subject, (c: PartyRole[]) => this.updateRoles(c));
    return subject;
  }

  private saveCases(): void {
    localStorage.setItem(this.casesstorage, JSON.stringify({
      casechilds: this.casechilds.value,
      cases: this.cases.value,
      casestatus: this.caseStatus.value,
      casetypes: this.caseTypes.value,
      rootcases: this.caseroots.value,
      ts: this.casessync,
    }));
  }

  private casesynctimeout: any = null;
  private syncCases(): void {
    if (this.casesynctimeout != null) {
      clearTimeout(this.casesynctimeout);
      this.casesynctimeout = null;
    }
    let url: string = this.config.api.baseUrl + '/cases' + (this.casessync > 0 ? '/' + this.casessync : '');
    this.casessync = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <CasesResponse>reply.payload;
        this.updateCaseStatus(response.casestatus);
        this.updateCaseTypes(response.casetypes);
        this.updateCases(response.cases);
        this.saveCases();
      }
      this.casesynctimeout = setTimeout(() => { this.syncCases(); }, 30000);
    });
  }

  private updateAddresses(addresses: Address[]) {
    this.addresses.next(addresses);
  }

  private updateCases(cases: Case[]): void {
    if (cases.length == 0)
      return;
    let needsrefresh = false;
    let tempcases = { ...this.cases.value };
    cases.forEach((c) => { if (this._updateCase(tempcases, c)) needsrefresh = true; });
    this.cases.next(tempcases);
    if (needsrefresh)
      this._updateCasesEvaluation(tempcases);
  }

  private _updateCase(cases: { [key: number]: Case }, c: Case): boolean {
    let needsrefresh = false;
    if (cases[c.id] != undefined) {
      if (cases[c.id].parentid != c.parentid)
        needsrefresh = true;
    }
    else
      needsrefresh = true;
    if (c.deleted == null)
      cases[c.id] = c;
    else {
      delete cases[c.id];
      needsrefresh = true;
    }
    return needsrefresh;
  }

  private _updateCasesEvaluation(cases: { [key: number]: Case }): void {
    let rootcases: number[] = [];
    let casechilds: { [key: number]: number[] } = {};
    for (let key in cases) {
      let c = cases[key];
      if (c.parentid == null) {
        rootcases.push(c.id);
        casechilds[c.id] = [];
      } else {
        if (casechilds[c.parentid] == undefined)
          casechilds[c.parentid] = [];
        casechilds[c.parentid].push(c.id);
      }
    }
    rootcases.sort((a, b) => cases[a].title > cases[b].title ? 1 : -1);
    this.casechilds.next(casechilds);
    this.caseroots.next(rootcases);
    this.syncCases();
  }

  private updateCaseStatus(items: CaseStatus[]): void {
    if (items.length == 0)
      return;
    let temp = this.caseStatus.value;
    items.forEach((cs) => {
      if (cs.deleted == null)
        temp[cs.id] = cs;
      else
        delete temp[cs.id];
    });
    this.caseStatus.next(temp);
  }

  private updateCaseTypes(items: CaseType[]): void {
    if (items.length == 0)
      return;
    let temp = this.caseTypes.value;
    items.forEach((cs) => {
      if (cs.deleted == null)
        temp[cs.id] = cs;
      else
        delete temp[cs.id];
    });
    this.caseTypes.next(temp);
  }

  private updateClasses(classes: Class[]) {
    this.classes.next(classes);
  }

  private updateClients(clients: Party[]) {
    this.clients.next(clients);
  }

  private updateContacts(contacts: PartyContact[]) {
    this.contacts.next(contacts);
  }

  private updateContactTypes(contacttypes: ContactType[]) {
    this.contacttypes.next(contacttypes);
  }

  private updateCountries(countries: Country[]) {
    this.countries.next(countries);
  }

  private updateCurrencies(currencies: Currency[]) {
    this.currencies.next(currencies);
  }

  private updateFiletypes(filetypes: CaseFiletype[]) {
    this.filetypes.next(filetypes);
  }

  private updateParties(parties: Party[]) {
    this.parties.next(parties);
  }

  private updateRoles(roles: PartyRole[]) {
    this.roles.next(roles);
  }

  updateCase(item: Case): BehaviorSubject<Case | null> {
    let subject = new BehaviorSubject<Case | null>(null);
    this.postObject(item.id == 0 ? 'create' : 'update', item,
      'case', subject, (c: Case[]) => { this.updateCases(c); this.saveCases(); });
    return subject;
  }

  updateClass(classitem: Class): BehaviorSubject<Class | null> {
    let subject = new BehaviorSubject<Class | null>(null);
    this.postCommon(classitem.id == 0 ? 'create' : 'update', classitem,
      'class', this.classes.value, subject, (c: Class[]) => this.updateClasses(c));
    return subject;
  }

  updateContactType(typeitem: ContactType): BehaviorSubject<ContactType | null> {
    let subject = new BehaviorSubject<ContactType | null>(null);
    this.postCommon(typeitem.id == 0 ? 'create' : 'update', typeitem,
      'contacttype', this.contacttypes.value, subject, (c: ContactType[]) => this.updateContactTypes(c));
    return subject;
  }

  updateCountry(countryitem: Country): BehaviorSubject<Country | null> {
    let subject = new BehaviorSubject<Country | null>(null);
    this.postCommon(countryitem.id == 0 ? 'create' : 'update', countryitem,
      'country', this.countries.value, subject, (c: Country[]) => this.updateCountries(c));
    return subject;
  }

  updateCurrency(currencyitem: Currency): BehaviorSubject<Currency | null> {
    let subject = new BehaviorSubject<Currency | null>(null);
    this.postCommon(currencyitem.id == 0 ? 'create' : 'update', currencyitem,
      'currency', this.currencies.value, subject, (c: Currency[]) => this.updateCurrencies(c));
    return subject;
  }

  updateRole(roleitem: PartyRole): BehaviorSubject<PartyRole | null> {
    let subject = new BehaviorSubject<PartyRole | null>(null);
    this.postCommon(roleitem.id == 0 ? 'create' : 'update', roleitem,
      'role', this.roles.value, subject, (c: PartyRole[]) => this.updateRoles(c));
    return subject;
  }

  updateSettings(settings: Settings, push: boolean = false) {
    this.settings.next(settings);
    if (push) {
      let url = this.configService.config.api.baseUrl + '/user/settings';
      this.authService.updateApi(url, { userSettings: settings });
    }
  }

  updateUser(user: User, push: boolean = false) {
    this.user.next(user);
    this.updateSettings(user.settings, push);
  }

  updateWorkProps(props: WorkProperties, push: boolean = false) {
    this.workprops.next(props);
    if (push) {
      let url = this.configService.config.api.baseUrl + '/work/settings';
      this.authService.updateApi(url, { workSettings: props });
    }
  }

}

export interface CasesResponse {
  cases: Case[];
  casestatus: CaseStatus[];
  casetypes: CaseType[];
}

export interface CasesStorage {
  rootcases: number[];
  casechilds: { [key: number]: number[] };
  cases: { [key: number]: Case };
  casestatus: { [key: number]: CaseStatus };
  casetypes: { [key: number]: CaseType };
  ts: number;
}
