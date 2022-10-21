import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Address,
  BankAccount,
  Case,
  CaseFiletype,
  CaseStatus,
  CaseType,
  Class,
  ContactType,
  Country,
  Currency,
  Party,
  PartyContact,
  PartyRole,
  User,
  UserSettings,
  WorkCustomer,
  WorkProperties
} from 'src/app/if';
import { AuthService } from '../../auth.service';
import { AppConfig, ConfigService } from '../../config.service';

@Injectable()
export class SettingsService {

  private archiveLoaded: boolean = false;
  private componentRefresher: any;

  private clientSettings: BehaviorSubject<ClientSettings> = new BehaviorSubject<ClientSettings>({
    casesettings: {
      showCasesInDeletion: false,
      showCasesInRetention: false,
    }
  });
  clientSettings$ = this.clientSettings.asObservable();
  private clientSettingsStorage: string = 'userSettings';

  private casesstorage: string = this.config.storage.prefix + 'casesData';
  private casessync: number = 0;
  private financestorage: string = this.config.storage.prefix + 'financeData';
  private financesync: number = 0;
  private partiesstorage: string = this.config.storage.prefix + 'partiesData';
  private partiessync: number = 0;
  private workstorage: string = this.config.storage.prefix + 'workData';
  private worksync: number = 0;

  constructor(private authService: AuthService,
    private configService: ConfigService) {
    this.loadCasesData();
    this.loadFinanceData();
    this.loadPartiesData();
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
      this.casefiletypes.next(olddata.casefiletypes);
      this.caseroots.next(olddata.rootcases);
      this.caseStatus.next(olddata.casestatus);
      this.caseTypes.next(olddata.casetypes);
      this.casessync = olddata.ts;
    }
    this.syncCases();
  }

  private loadFinanceData(): void {
    let olddata: string | null | FinanceStorage = localStorage.getItem(this.financestorage);
    if (olddata) {
      olddata = <FinanceStorage>JSON.parse(olddata);

      this.financesync = olddata.ts;
    }
    this.syncFinance();
  }

  private loadPartiesData(): void {
    let olddata: string | null | PartiesStorage = localStorage.getItem(this.partiesstorage);
    if (olddata) {
      olddata = <PartiesStorage>JSON.parse(olddata);
      this.addresses.next(olddata.addresses);
      this.banks.next(olddata.banks);
      this.clients.next(olddata.clients);
      this.contacts.next(olddata.contacts);
      this.contacttypes.next(olddata.contacttypes);
      this.parties.next(olddata.parties);
      this.roles.next(olddata.roles);
      this.partiessync = olddata.ts;
    }
    this.syncParties();
  }

  public loadArchiveSettings(): void {
    if (this.archiveLoaded)
      return;
    this.archiveLoaded = true;
    let url = this.configService.config.api.baseUrl + '/common/props';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        this.updateClasses(reply.payload['classes']);
        this.updateCountries(reply.payload['countries']);
        this.updateCurrencies(reply.payload['currencies']);
      }
    });
    this.caseFileStatus.next(['new', 'checked', 'approved']);
  }

  private loadUserSettings(): void {
    let olddata: string | null | WorkStorage = localStorage.getItem(this.workstorage);
    if (olddata) {
      olddata = <WorkStorage>JSON.parse(olddata);
      this.customers.next(olddata.customers);
      this.worksync = olddata.ts;
    }
    this.syncWork();
  }

  public loadWorkEntities(): void {
    let olddata: string | null | ClientSettings = localStorage.getItem(this.clientSettingsStorage);
    if (olddata) {
      olddata = <ClientSettings>JSON.parse(olddata);
      this.clientSettings.next(olddata);
    }
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

  private addresses: BehaviorSubject<{ [key: number]: Address }> = new BehaviorSubject<{ [key: number]: Address }>({});
  addresses$ = this.addresses.asObservable();

  private banks: BehaviorSubject<{ [key: number]: Party }> = new BehaviorSubject<{ [key: number]: Party }>({});
  banks$ = this.banks.asObservable();

  private cases: BehaviorSubject<{ [key: number]: Case }> = new BehaviorSubject<{ [key: number]: Case }>({});
  cases$ = this.cases.asObservable();

  getCase(id: number | null): Case | null {
    if (id == null)
      return null;
    if (this.cases.value[id])
      return this.cases.value[id];
    return null;
  }

  hasParentCaseWithId(caseid: number, parentid: number): boolean {
    if (caseid == parentid)
      return true;
    let case1 = this.getCase(caseid);
    if (case1 == null)
      return false;
    if (case1.parentid == parentid)
      return true;
    if (case1.parentid != null) {
      return this.hasParentCaseWithId(case1.parentid, parentid);
    }
    return false;
  }

  private casechilds: BehaviorSubject<{ [key: number]: number[] }> = new BehaviorSubject<{ [key: number]: number[] }>({});
  casechilds$ = this.casechilds.asObservable();

  getCaseChilds(id: number): number[] {
    if (!this.casechilds.value[id])
      return [];
    let childs = this.casechilds.value[id];
    childs.sort((a, b) => this.getCase(a)!.casepath > this.getCase(b)!.casepath ? 1 : this.getCase(a)!.casepath < this.getCase(b)!.casepath ? -1 : 0);
    return childs;
  }

  hasChildCases(id: number): boolean {
    return this.casechilds.value[id] != undefined && this.casechilds.value[id].length > 0;
  }

  private caseroots: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  caseroots$ = this.caseroots.asObservable();

  private caseFileStatus: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  caseFileStatus$ = this.caseFileStatus.asObservable();

  private casefiletypes: BehaviorSubject<{ [key: number]: CaseFiletype }> = new BehaviorSubject<{ [key: number]: CaseFiletype }>({});
  casefiletypes$ = this.casefiletypes.asObservable();

  getCaseFiletype(id: number | null): CaseFiletype | null {
    if (id == null)
      return null;
    if (this.casefiletypes.value[id])
      return this.casefiletypes.value[id];
    return null;
  }

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

  private clients: BehaviorSubject<{ [key: number]: Party }> = new BehaviorSubject<{ [key: number]: Party }>({});
  clients$ = this.clients.asObservable();

  private contacts: BehaviorSubject<{ [key: number]: PartyContact }> = new BehaviorSubject<{ [key: number]: PartyContact }>({});
  contacts$ = this.contacts.asObservable();

  private contacttypes: BehaviorSubject<{ [key: number]: ContactType }> = new BehaviorSubject<{ [key: number]: ContactType }>({});
  contacttypes$ = this.contacttypes.asObservable();

  private countries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);
  countries$ = this.countries.asObservable();

  private currencies: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);
  currencies$ = this.currencies.asObservable();

  private customers: BehaviorSubject<WorkCustomer[]> = new BehaviorSubject<WorkCustomer[]>([]);
  customers$ = this.customers.asObservable();

  private parties: BehaviorSubject<{ [key: number]: Party }> = new BehaviorSubject<{ [key: number]: Party }>({});
  parties$ = this.parties.asObservable();

  private roles: BehaviorSubject<{ [key: number]: PartyRole }> = new BehaviorSubject<{ [key: number]: PartyRole }>({});
  roles$ = this.roles.asObservable();

  private settings: BehaviorSubject<UserSettings | null> = new BehaviorSubject<UserSettings | null>(null);
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
    //this.postCommon('delete', ctypeitem, 'contacttype', this.contacttypes.value, subject, (c: ContactType[]) => this.updateContactTypes(c));
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
    //this.postCommon('delete', roleitem, 'role', this.roles.value, subject, (c: PartyRole[]) => this.updateRoles(c));
    return subject;
  }

  private saveCases(): void {
    localStorage.setItem(this.casesstorage, JSON.stringify({
      casechilds: this.casechilds.value,
      casefiletypes: this.casefiletypes.value,
      cases: this.cases.value,
      casestatus: this.caseStatus.value,
      casetypes: this.caseTypes.value,
      rootcases: this.caseroots.value,
      ts: this.casessync,
    }));
  }

  private saveClientSettings(): void {
    localStorage.setItem(this.clientSettingsStorage, JSON.stringify(this.clientSettings.value));
  }

  private saveFinance(): void {
    localStorage.setItem(this.financestorage, JSON.stringify({

      ts: this.financesync,
    }));
  }

  private saveParties(): void {
    localStorage.setItem(this.partiesstorage, JSON.stringify({
      addresses: this.addresses.value,
      banks: this.banks.value,
      clients: this.clients.value,
      contacts: this.contacts.value,
      contacttypes: this.contacttypes.value,
      parties: this.parties.value,
      roles: this.roles.value,
      ts: this.partiessync,
    }));
  }

  private saveWork(): void {
    localStorage.setItem(this.workstorage, JSON.stringify({
      customers: this.customers.value,
      ts: this.casessync,
    }));
  }

  showCasesInDeletion(newvalue: boolean): void {
    if (this.clientSettings.value.casesettings.showCasesInDeletion != newvalue) {
      let settings = { ...this.clientSettings.value };
      settings.casesettings.showCasesInDeletion = newvalue;
      this.clientSettings.next(settings);
      this.saveClientSettings();
    }
  }

  showCasesInRetention(newvalue: boolean): void {
    if (this.clientSettings.value.casesettings.showCasesInRetention != newvalue) {
      let settings = { ...this.clientSettings.value };
      settings.casesettings.showCasesInRetention = newvalue;
      this.clientSettings.next(settings);
      this.saveClientSettings();
    }
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
        this.updateCaseFiletypes(response.casefiletypes);
        this.updateCaseStatus(response.casestatus);
        this.updateCaseTypes(response.casetypes);
        this.updateCases(response.cases);
        this.saveCases();
      }
      this.casesynctimeout = setTimeout(() => { this.syncCases(); }, 30000);
    });
  }

  private financesynctimeout: any = null;
  private syncFinance(): void {
    if (this.financesynctimeout != null) {
      clearTimeout(this.financesynctimeout);
      this.financesynctimeout = null;
    }
    let url: string = this.config.api.baseUrl + '/finance' + (this.financesync > 0 ? '/' + this.financesync : '');
    this.financesync = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <FinanceResponse>reply.payload;

        this.saveFinance();
      }
      this.financesynctimeout = setTimeout(() => { this.syncFinance(); }, 30000);
    });
  }

  private partiessynctimeout: any = null;
  private syncParties(): void {
    if (this.partiessynctimeout != null) {
      clearTimeout(this.partiessynctimeout);
      this.partiessynctimeout = null;
    }
    let url: string = this.config.api.baseUrl + '/parties' + (this.partiessync > 0 ? '/' + this.partiessync : '');
    this.partiessync = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <PartiesResponse>reply.payload;
        this.updateAddresses(response.addresses);
        this.updateBanks(response.banks);
        this.updateClients(response.clients);
        this.updateContacts(response.contacts);
        this.updateContactTypes(response.contacttypes);
        this.updateParties(response.parties);
        this.updateRoles(response.roles);
        this.saveParties();
      }
      this.partiessynctimeout = setTimeout(() => { this.syncParties(); }, 15000);
    });
  }

  private worksynctimeout: any = null;
  private syncWork(): void {
    if (this.worksynctimeout != null) {
      clearTimeout(this.worksynctimeout);
      this.worksynctimeout = null;
    }
    let url: string = this.config.api.baseUrl + '/work' + (this.worksync > 0 ? '/' + this.worksync : '');
    this.worksync = Math.floor(Date.now() / 1000);
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <WorkResponse>reply.payload;
        this.updateCustomers(response.customers);
        this.saveWork();
      }
      this.worksynctimeout = setTimeout(() => { this.syncWork(); }, 30000);
    });
  }

  private _updateCommon<T extends CommonProperty>(listing: { [key: number]: T }, item: T): void {
    if (item.deleted == null)
      listing[item.id] = item;
    else
      delete listing[item.id];
  }

  private updateAddresses(addresses: Address[]) {
    let temp = { ...this.addresses.value };
    addresses.forEach((a) => this._updateCommon(temp, a));
    this.addresses.next(temp);
  }

  private updateBanks(banks: Party[]) {
    let temp = { ...this.banks.value };
    banks.forEach((a) => this._updateCommon(temp, a));
    this.banks.next(temp);
  }

  private updateCaseFiletypes(items: CaseFiletype[]): void {
    if (items.length == 0)
      return;
    let temp = this.casefiletypes.value;
    items.forEach((cs) => {
      if (cs.deleted == null)
        temp[cs.id] = cs;
      else
        delete temp[cs.id];
    });
    this.casefiletypes.next(temp);
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
    let temp = { ...this.clients.value };
    clients.forEach((a) => this._updateCommon(temp, a));
    this.clients.next(temp);
  }

  private updateContacts(contacts: PartyContact[]) {
    let temp = { ...this.contacts.value };
    contacts.forEach((a) => this._updateCommon(temp, a));
    this.contacts.next(temp);
  }

  private updateContactTypes(contacttypes: ContactType[]) {
    let temp = { ...this.contacttypes.value };
    contacttypes.forEach((a) => this._updateCommon(temp, a));
    this.contacttypes.next(temp);
  }

  private updateCountries(countries: Country[]) {
    this.countries.next(countries);
  }

  private updateCurrencies(currencies: Currency[]) {
    this.currencies.next(currencies);
  }

  private updateCustomers(customers: WorkCustomer[]) {
    this.customers.next(customers);
  }

  private updateParties(parties: Party[]) {
    let temp = { ...this.parties.value };
    parties.forEach((a) => this._updateCommon(temp, a));
    this.parties.next(temp);
  }

  private updateRoles(roles: PartyRole[]) {
    let temp = { ...this.roles.value };
    roles.forEach((a) => this._updateCommon(temp, a));
    this.roles.next(temp);
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
    //this.postCommon(typeitem.id == 0 ? 'create' : 'update', typeitem,

    //'contacttype', this.contacttypes.value, subject, (c: ContactType[]) => this.updateContactTypes(c));
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

  updateCustomer(customeritem: WorkCustomer): BehaviorSubject<WorkCustomer | null> {
    let subject = new BehaviorSubject<WorkCustomer | null>(null);
    this.postCommon(customeritem.id == 0 ? 'create' : 'update', customeritem,
      'customer', this.customers.value, subject, (c: WorkCustomer[]) => this.updateCustomers(c));
    return subject;
  }

  updateRole(roleitem: PartyRole): BehaviorSubject<PartyRole | null> {
    let subject = new BehaviorSubject<PartyRole | null>(null);
    //this.postCommon(roleitem.id == 0 ? 'create' : 'update', roleitem,
    //  'role', this.roles.value, subject, (c: PartyRole[]) => this.updateRoles(c));
    return subject;
  }

  updateSettings(settings: UserSettings, push: boolean = false) {
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
  casefiletypes: CaseFiletype[];
  casestatus: CaseStatus[];
  casetypes: CaseType[];
}

export interface CasesStorage {
  rootcases: number[];
  casechilds: { [key: number]: number[] };
  casefiletypes: { [key: number]: CaseFiletype };
  cases: { [key: number]: Case };
  casestatus: { [key: number]: CaseStatus };
  casetypes: { [key: number]: CaseType };
  ts: number;
}

export interface CommonProperty {
  deleted: string | null;
  id: number;
}

export interface FinanceResponse {
  accounts: BankAccount[];
  countries: Country[];
  currencies: Currency[];
  // expenseCategories: 
}

export interface FinanceStorage {

  ts: number;
}

export interface PartiesResponse {
  addresses: Address[];
  banks: Party[];
  clients: Party[];
  contacts: PartyContact[];
  contacttypes: ContactType[];
  parties: Party[];
  roles: PartyRole[];
}

export interface PartiesStorage {
  addresses: { [key: number]: Address };
  banks: { [key: number]: Party };
  clients: { [key: number]: Party };
  contacts: { [key: number]: PartyContact };
  contacttypes: { [key: number]: ContactType };
  parties: { [key: number]: Party };
  roles: { [key: number]: PartyRole };
  ts: number;
}

export interface ClientSettings {
  casesettings: ClientCaseSettings
}

export interface ClientCaseSettings {
  showCasesInDeletion: boolean;
  showCasesInRetention: boolean;
}

export interface WorkResponse {
  customers: WorkCustomer[];
}

export interface WorkStorage {
  customers: WorkCustomer[];
  ts: number;
}
