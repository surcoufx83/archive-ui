import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  ExpenseCategory,
  ExpenseType,
  Note,
  Party,
  PartyContact,
  PartyRole,
  SepaMandate,
  ServerNotification,
  Stock,
  StockApi,
  Tag,
  User,
  UserSettings,
  WarehouseItem,
  WarehouseRoom,
  WarehouseSpace,
  WorkCustomer,
  WorkLead,
  WorkOffCategory,
  WorkProject,
  WorkTimeCategory
} from 'src/app/if';
import { WarehouseReply } from 'src/app/warehouse/warehouse.component';
import { AuthService } from '../auth.service';
import { AppConfig, ConfigService } from '../config.service';
import { StorageService } from './storage.service';

const cases = 'cases';
const client = 'client';
const finance = 'finance';
const notes = 'notes';
const notifications = 'notifications';
const parties = 'parties';
const tags = 'tags';
const user = 'user';
const work = 'work';

@Injectable()
export class SettingsService {

  private archiveLoaded: boolean = false;

  private addresses: BehaviorSubject<{ [key: number]: Address }> = new BehaviorSubject<{ [key: number]: Address }>({});
  addresses$ = this.addresses.asObservable();

  private banks: BehaviorSubject<{ [key: number]: Party }> = new BehaviorSubject<{ [key: number]: Party }>({});
  banks$ = this.banks.asObservable();

  private bankAccounts: BehaviorSubject<{ [key: number]: BankAccount }> = new BehaviorSubject<{ [key: number]: BankAccount }>({});
  bankAccounts$ = this.bankAccounts.asObservable();

  private caseChilds: BehaviorSubject<{ [key: number]: number[] }> = new BehaviorSubject<{ [key: number]: number[] }>({});
  caseChilds$ = this.caseChilds.asObservable();

  private caseFileStatus: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  caseFileStatus$ = this.caseFileStatus.asObservable();

  private caseFileTypes: BehaviorSubject<{ [key: number]: CaseFiletype }> = new BehaviorSubject<{ [key: number]: CaseFiletype }>({});
  caseFileTypes$ = this.caseFileTypes.asObservable();

  private caseRoots: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  caseRoots$ = this.caseRoots.asObservable();

  private cases: BehaviorSubject<{ [key: number]: Case }> = new BehaviorSubject<{ [key: number]: Case }>({});
  cases$ = this.cases.asObservable();

  private caseStatus: BehaviorSubject<{ [key: number]: CaseStatus }> = new BehaviorSubject<{ [key: number]: CaseStatus }>({});
  caseStatus$ = this.caseStatus.asObservable();

  private caseTypes: BehaviorSubject<{ [key: number]: CaseType }> = new BehaviorSubject<{ [key: number]: CaseType }>({});
  caseTypes$ = this.caseTypes.asObservable();

  private classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);
  classes$ = this.classes.asObservable();

  private clients: BehaviorSubject<{ [key: number]: Party }> = new BehaviorSubject<{ [key: number]: Party }>({});
  clients$ = this.clients.asObservable();

  private clientSettings: BehaviorSubject<ClientSettings> = new BehaviorSubject<ClientSettings>({
    casesettings: {
      showCasesInDeletion: false,
      showCasesInRetention: false,
    }
  });
  clientSettings$ = this.clientSettings.asObservable();

  private contacts: BehaviorSubject<{ [key: number]: PartyContact }> = new BehaviorSubject<{ [key: number]: PartyContact }>({});
  contacts$ = this.contacts.asObservable();

  private contactTypes: BehaviorSubject<{ [key: number]: ContactType }> = new BehaviorSubject<{ [key: number]: ContactType }>({});
  contactTypes$ = this.contactTypes.asObservable();

  private countries: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);
  countries$ = this.countries.asObservable();

  private currencies: BehaviorSubject<Currency[]> = new BehaviorSubject<Currency[]>([]);
  currencies$ = this.currencies.asObservable();

  private expenseCategories: BehaviorSubject<{ [key: number]: ExpenseCategory }> = new BehaviorSubject<{ [key: number]: ExpenseCategory }>({});
  expenseCategories$ = this.expenseCategories.asObservable();

  private expenseTypes: BehaviorSubject<{ [key: number]: ExpenseType }> = new BehaviorSubject<{ [key: number]: ExpenseType }>({});
  expenseTypes$ = this.expenseTypes.asObservable();

  private notepadItems: BehaviorSubject<{ [key: number]: Note }> = new BehaviorSubject<{ [key: number]: Note }>({});
  notepadItems$ = this.notepadItems.asObservable();

  private notifications: BehaviorSubject<ServerNotification[]> = new BehaviorSubject<ServerNotification[]>([]);
  notifications$ = this.notifications.asObservable();

  private parties: BehaviorSubject<{ [key: number]: Party }> = new BehaviorSubject<{ [key: number]: Party }>({});
  parties$ = this.parties.asObservable();

  private roles: BehaviorSubject<{ [key: number]: PartyRole }> = new BehaviorSubject<{ [key: number]: PartyRole }>({});
  roles$ = this.roles.asObservable();

  private sepaMandates: BehaviorSubject<{ [key: number]: SepaMandate }> = new BehaviorSubject<{ [key: number]: SepaMandate }>({});
  sepaMandates$ = this.sepaMandates.asObservable();

  private settings: BehaviorSubject<UserSettings | null> = new BehaviorSubject<UserSettings | null>(null);
  settings$ = this.settings.asObservable();

  private stocks: BehaviorSubject<{ [key: number]: Stock }> = new BehaviorSubject<{ [key: number]: Stock }>({});
  stocks$ = this.stocks.asObservable();

  private stocksApis: BehaviorSubject<{ [key: number]: StockApi }> = new BehaviorSubject<{ [key: number]: StockApi }>({});
  stocksApis$ = this.stocksApis.asObservable();

  private tags: BehaviorSubject<{ [key: number]: Tag }> = new BehaviorSubject<{ [key: number]: Tag }>({});
  tags$ = this.tags.asObservable();

  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.user.asObservable();

  private warehouseRooms: BehaviorSubject<WarehouseRoom[] | null> = new BehaviorSubject<WarehouseRoom[] | null>(null);
  warehouseRooms$ = this.warehouseRooms.asObservable();

  private warehouseSpaces: BehaviorSubject<{ [key: number]: WarehouseSpace } | null> = new BehaviorSubject<{ [key: number]: WarehouseSpace } | null>(null);
  warehouseSpaces$ = this.warehouseSpaces.asObservable();

  private workCustomers: BehaviorSubject<{ [key: number]: WorkCustomer }> = new BehaviorSubject<{ [key: number]: WorkCustomer }>({});
  workCustomers$ = this.workCustomers.asObservable();

  private workLeads: BehaviorSubject<{ [key: number]: WorkLead }> = new BehaviorSubject<{ [key: number]: WorkLead }>({});
  workLeads$ = this.workLeads.asObservable();

  private workOfftimeCategories: BehaviorSubject<{ [key: number]: WorkOffCategory }> = new BehaviorSubject<{ [key: number]: WorkOffCategory }>({});
  workOfftimeCategories$ = this.workOfftimeCategories.asObservable();

  private workProjects: BehaviorSubject<{ [key: number]: WorkProject }> = new BehaviorSubject<{ [key: number]: WorkProject }>({});
  workProjects$ = this.workProjects.asObservable();

  private workTimeCategories: BehaviorSubject<{ [key: number]: WorkTimeCategory }> = new BehaviorSubject<{ [key: number]: WorkTimeCategory }>({});
  workTimeCategories$ = this.workTimeCategories.asObservable();

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private storageService: StorageService) {
    this.loadAllCacheItems();
    this.authService.isLoggedIn.subscribe((state) => {
      if (state != undefined && state === false) {
        this.clearCache(false);
        localStorage.clear();
      }
    });
  }

  public clearCache(reload: boolean = true): void {
    this.storageService.clearCache();
    this.archiveLoaded = false;
    if (reload) {
      this.loadArchiveSettings();
      this.loadAllCacheItems();
    }
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  private loadAllCacheItems(): void {
    this.loadUserSettings();
    this.loadCasesData();
    this.loadFinanceData();
    this.loadNotepadData();
    this.loadPartiesData();
    this.loadTags();
    this.loadWork();
    this.syncNotifications()
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

  private loadCasesData(): void {
    let olddata: string | null | CasesStorage = this.storageService.load(cases);
    if (olddata) {
      olddata = <CasesStorage>JSON.parse(olddata);
      this.cases.next(olddata.cases);
      this.caseChilds.next(olddata.casechilds);
      this.caseFileTypes.next(olddata.casefiletypes);
      this.caseRoots.next(olddata.rootcases);
      this.caseStatus.next(olddata.casestatus);
      this.caseTypes.next(olddata.casetypes);
    }
    this.syncCases();
  }

  private loadFinanceData(): void {
    let olddata: string | null | FinanceStorage = this.storageService.load(finance);
    if (olddata) {
      olddata = <FinanceStorage>JSON.parse(olddata);
      this.bankAccounts.next(olddata.bankAccounts);
      this.countries.next(olddata.countries);
      this.currencies.next(olddata.currencies);
      this.expenseCategories.next(olddata.expenseCategories);
      this.expenseTypes.next(olddata.expenseTypes);
      this.sepaMandates.next(olddata.sepaMandates);
      this.stocks.next(olddata.stocks);
      this.stocksApis.next(olddata.stocksApis);
    }
    this.syncFinance();
  }

  private loadNotepadData(): void {
    let olddata: string | null | NotepadStorage = this.storageService.load(notes);
    if (olddata) {
      olddata = <NotepadStorage>JSON.parse(olddata);
      this.notepadItems.next(olddata.notes);
    }
    this.syncNotepad();
  }

  private loadPartiesData(): void {
    let olddata: string | null | PartiesStorage = this.storageService.load(parties);
    if (olddata) {
      olddata = <PartiesStorage>JSON.parse(olddata);
      this.addresses.next(olddata.addresses);
      this.banks.next(olddata.banks);
      this.clients.next(olddata.clients);
      this.contacts.next(olddata.contacts);
      this.contactTypes.next(olddata.contacttypes);
      this.parties.next(olddata.parties);
      this.roles.next(olddata.roles);
    }
    this.syncParties();
  }

  private loadTags(): void {
    let olddata: string | null | TagsStorage = this.storageService.load(tags);
    if (olddata) {
      olddata = <TagsStorage>JSON.parse(olddata);
      this.tags.next(olddata.tags);
    }
    this.syncTags();
  }

  public loadUserSettings(): void {
    let olddata: string | null | ClientSettings = this.storageService.load(client);
    if (olddata) {
      olddata = <ClientSettings>JSON.parse(olddata);
      this.clientSettings.next(olddata);
    }
    let olddata2: string | null | UserSettingsStorage = this.storageService.load(user);
    if (olddata2) {
      olddata2 = <UserSettingsStorage>JSON.parse(olddata2);
      this.updateUser(olddata2.user, false);
    }
    this.authService.queryApi(this.storageService.getSyncUrl(user)).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        reply.payload['version'] = this.storageService.getExpectedStorageVersion(user);
        this.updateUser(<User>reply.payload['user']);
        this.storageService.save(user, reply.payload);
      }
    });
  }


  public loadWarehouseEntities(): void {
    this.authService.queryApi('api/warehouse').subscribe((reply) => {
      if (reply.success && reply.payload != undefined && reply.payload['rooms'] != undefined && reply.payload['spaces'] != undefined) {
        const payload = <WarehouseReply>reply.payload;
        let roomidmapper: { [key: number]: number } = {};
        payload.rooms.forEach((room, i) => {
          room.urlname = room.name.replace(/\s/ig, '-');
          room.spaces = [];
          roomidmapper[room.id] = i;
        });
        let tempspaces: { [key: number]: WarehouseSpace } = {}
        payload.spaces.sort((a, b) => a.roomid != b.roomid ? a.roomid - b.roomid : a.level != b.level ? a.level - b.level : a.order - b.order);
        payload.spaces.forEach((space) => {
          space.children = [];
          tempspaces[space.id] = space;
          if (space.parentid !== null) {
            if (tempspaces[space.parentid] !== undefined)
              tempspaces[space.parentid].children.push(space.id);
            else
              console.warn(`Found warehouse space ${space.id} with parentid ${space.parentid} is not yet loaded`)
          }
          else {
            if (payload.rooms[roomidmapper[space.roomid]] !== undefined)
              payload.rooms[roomidmapper[space.roomid]].spaces.push(space.id);
            else
              console.warn(`Found warehouse space ${space.id} with roomid ${space.roomid} is not yet loaded`)
          }
        });
        this.warehouseRooms.next(payload.rooms.sort((a, b) => a.order - b.order));
        this.warehouseSpaces.next(tempspaces);
      }
    });
  }

  public loadWarehouseItems(room: WarehouseRoom): Subject<boolean | WarehouseItem[]> {
    let subject = new Subject<boolean | WarehouseItem[]>();
    this.authService.queryApi(`api/warehouse/${room.id}/items`).subscribe((reply) => {
      if (reply.success && reply.payload != undefined && reply.payload['items'] != undefined) {
        subject.next(<WarehouseItem[]>reply.payload['items']);
        subject.complete();
      }
      else {
        subject.next(false);
        subject.complete();
      }
    });
    return subject;
  }

  private loadWork(): void {
    let olddata: string | null | WorkStorage = this.storageService.load(work);
    if (olddata) {
      olddata = <WorkStorage>JSON.parse(olddata);
      this.workCustomers.next(olddata.customers);
      this.workLeads.next(olddata.leads);
      this.workOfftimeCategories.next(olddata.offCategories);
      this.workProjects.next(olddata.projects);
      this.workTimeCategories.next(olddata.timeCategories);
    }
    this.syncWork();
  }

  public setTimeout(timeout: any): void {
    this.storageService.setTimeout('comp', timeout);
  }

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

  getCaseChilds(id: number): number[] {
    if (!this.caseChilds.value[id])
      return [];
    let childs = this.caseChilds.value[id];
    childs.sort((a, b) => this.getCase(a)!.casepath > this.getCase(b)!.casepath ? 1 : this.getCase(a)!.casepath < this.getCase(b)!.casepath ? -1 : 0);
    return childs;
  }

  hasChildCases(id: number): boolean {
    return this.caseChilds.value[id] != undefined && this.caseChilds.value[id].length > 0;
  }

  getCaseFiletype(id: number | null): CaseFiletype | null {
    if (id == null)
      return null;
    if (this.caseFileTypes.value[id])
      return this.caseFileTypes.value[id];
    return null;
  }

  getCaseStatus(id: number | null): CaseStatus | null {
    if (id == null)
      return null;
    if (this.caseStatus.value[id])
      return this.caseStatus.value[id];
    return null;
  }

  getCaseType(id: number | null): CaseType | null {
    if (id == null)
      return null;
    if (this.caseTypes.value[id])
      return this.caseTypes.value[id];
    return null;
  }

  getCurrency(id: number | null): Currency | null {
    if (id == null)
      return null;
    for (let i = 0; i < this.currencies.value.length; i++) {
      if (this.currencies.value[i].id === id)
        return this.currencies.value[i];
    }
    return null;
  }

  getStock(id: number | null): Stock | null {
    if (id == null)
      return null;
    if (this.stocks.value[id])
      return this.stocks.value[id];
    return null;
  }

  getStocksApi(id: number | null): StockApi | null {
    if (id == null)
      return null;
    if (this.stocksApis.value[id])
      return this.stocksApis.value[id];
    return null;
  }

  getTag(id: number): Tag | null {
    return this.tags.value[id] ?? null;
  }

  getWarehouseRoom(id: number): WarehouseRoom | null {
    if (this.warehouseRooms.value == undefined)
      return null;
    for (let i = 0; i < this.warehouseRooms.value?.length; i++) {
      if (this.warehouseRooms.value[i].id === id)
        return this.warehouseRooms.value[i];
    }
    return null;
  }

  getWorkCustomer(id: number | null): WorkCustomer | null {
    if (id == null)
      return null;
    if (this.workCustomers.value[id])
      return this.workCustomers.value[id];
    return null;
  }

  getWorkLead(id: number | null): WorkLead | null {
    if (id == null)
      return null;
    if (this.workLeads.value[id])
      return this.workLeads.value[id];
    return null;
  }

  getWorkProject(id: number | null): WorkProject | null {
    if (id == null)
      return null;
    if (this.workProjects.value[id])
      return this.workProjects.value[id];
    return null;
  }

  getWorkProjects(customerid: number | null): WorkProject[] | null {
    if (customerid == null)
      return null;
    let projects = Object.values(this.workProjects.value).filter((e) => {
      return !e.disabled && +e.customerid === customerid;
    }).sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);
    return null;
  }

  getWorkTimeCategory(id: number | null): WorkTimeCategory | null {
    if (id == null)
      return null;
    if (this.workTimeCategories.value[id])
      return this.workTimeCategories.value[id];
    return null;
  }

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
    this.storageService.save(cases, {
      casechilds: this.caseChilds.value,
      casefiletypes: this.caseFileTypes.value,
      cases: this.cases.value,
      casestatus: this.caseStatus.value,
      casetypes: this.caseTypes.value,
      rootcases: this.caseRoots.value,
    });
  }

  private saveClientSettings(): void {
    this.storageService.setLastSync(client);
    this.storageService.save(client, this.clientSettings.value);
  }

  private saveFinance(): void {
    this.storageService.save(finance, {
      bankAccounts: this.bankAccounts.value,
      countries: this.countries.value,
      currencies: this.currencies.value,
      expenseCategories: this.expenseCategories.value,
      expenseTypes: this.expenseTypes.value,
      sepaMandates: this.sepaMandates.value,
      stocks: this.stocks.value,
      stocksApis: this.stocksApis.value,
    });
  }

  private saveNotepad(): void {
    this.storageService.save(notes, {
      notes: this.notepadItems.value,
    });
  }

  private saveParties(): void {
    this.storageService.save(parties, {
      addresses: this.addresses.value,
      banks: this.banks.value,
      clients: this.clients.value,
      contacts: this.contacts.value,
      contacttypes: this.contactTypes.value,
      parties: this.parties.value,
      roles: this.roles.value,
    });
  }

  private saveTags(): void {
    this.storageService.save(tags, {
      tags: this.tags.value,
    });
  }

  private saveWork(): void {
    this.storageService.save(work, {
      customers: this.workCustomers.value,
      leads: this.workLeads.value,
      offCategories: this.workOfftimeCategories.value,
      projects: this.workProjects.value,
      timeCategories: this.workTimeCategories.value,
    });
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

  private syncCases(): void {
    this.storageService.clearTimeout(cases);
    this.authService.queryApi(this.storageService.getSyncUrl(cases)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <CasesResponse>reply.payload;
        this.updateCaseFiletypes(response.casefiletypes);
        this.updateCaseStatus(response.casestatus);
        this.updateCaseTypes(response.casetypes);
        this.updateCases(response.cases);
        this.storageService.setLastSync(cases);
        this.saveCases();
      }
      this.storageService.setTimeout(cases, setTimeout(() => { this.syncCases(); }, this.storageService.getSyncInterval(cases)));
    });
  }

  public resyncFinance(): void {
    this.syncFinance();
  }
  private syncFinance(): void {
    this.storageService.clearTimeout(finance);
    this.authService.queryApi(this.storageService.getSyncUrl(finance)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <FinanceResponse>reply.payload;
        this.updateBankAccounts(response.accounts);
        this.updateCountries(response.countries);
        this.updateCurrencies(response.currencies);
        this.updateExpenseCategories(response.expenseCategories);
        this.updateExpenseTypes(response.expenseTypes);
        this.updateSepaMandates(response.sepaMandates);
        this.updateStocks(response.stocks);
        this.updateStocksApis(response.stocksApis);
        this.storageService.setLastSync(finance);
        this.saveFinance();
      }
      this.storageService.setTimeout(finance, setTimeout(() => { this.syncFinance(); }, this.storageService.getSyncInterval(finance)));
    });
  }

  public resyncNotepad(): void {
    this.syncNotepad();
  }
  private syncNotepad(): void {
    this.storageService.clearTimeout(notes);
    this.authService.queryApi(this.storageService.getSyncUrl(notes)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <NotepadResponse>reply.payload;
        this.updateNotes(response.notes);
        this.storageService.setLastSync(notes);
        this.saveNotepad();
      }
      this.storageService.setTimeout(notes, setTimeout(() => { this.syncNotepad(); }, this.storageService.getSyncInterval(notes)));
    });
  }

  public onNotificationShown(id: number): void {
    let notifications = [...this.notifications.value];
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].id == id) {
        notifications.splice(i, 1);
        let url: string = this.config.api.baseUrl + `/notification/read/${id}`;
        this.authService.updateApi(url, {}).subscribe(() => { });
        break;
      }
    }
    this.notifications.next(notifications);
  }

  private syncNotifications(): void {
    this.storageService.clearTimeout(notifications);
    this.authService.queryApi(this.storageService.getSyncUrl(notifications)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        const payload: NotificationsResponse = <NotificationsResponse>reply.payload;
        let notifications = [...this.notifications.value];
        payload.items.forEach((i) => notifications.push(i));
        this.notifications.next(notifications);
      }
      this.storageService.setTimeout(notifications, setTimeout(() => { this.syncNotifications(); }, this.storageService.getSyncInterval(notifications)));
    });
  }

  private syncParties(): void {
    this.storageService.clearTimeout(parties);
    this.authService.queryApi(this.storageService.getSyncUrl(parties)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <PartiesResponse>reply.payload;
        this.updateAddresses(response.addresses);
        this.updateBanks(response.banks);
        this.updateClients(response.clients);
        this.updateContacts(response.contacts);
        this.updateContactTypes(response.contacttypes);
        this.updateParties(response.parties);
        this.updateRoles(response.roles);
        this.storageService.setLastSync(parties);
        this.saveParties();
      }
      this.storageService.setTimeout(parties, setTimeout(() => { this.syncParties(); }, this.storageService.getSyncInterval(parties)));
    });
  }

  public syncTags(): void {
    this.storageService.clearTimeout(tags);
    this.authService.queryApi(this.storageService.getSyncUrl(tags)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <TagsResponse>reply.payload;
        if (response.tags.length > 0) {
          this.updateTags(response.tags);
          this.storageService.setLastSync(tags);
          this.saveTags();
        }
      }
      this.storageService.setTimeout(tags, setTimeout(() => { this.syncTags(); }, this.storageService.getSyncInterval(tags)));
    });
  }

  private syncWork(): void {
    this.storageService.clearTimeout(work);
    this.authService.queryApi(this.storageService.getSyncUrl(work)).subscribe((reply) => {
      if (reply.success && reply.payload != undefined) {
        let response = <WorkResponse>reply.payload;
        this.updateWorkCustomers(response.customers);
        this.updateWorkLeads(response.leads);
        this.updateWorkOffCategories(response.offCategories);
        this.updateWorkProjects(response.projects);
        this.updateWorkTimeCategories(response.timeCategories);
        this.storageService.setLastSync(work);
        this.saveWork();
      }
      this.storageService.setTimeout(work, setTimeout(() => { this.syncWork(); }, this.storageService.getSyncInterval(work)));
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
    let temp = this.caseFileTypes.value;
    items.forEach((cs) => {
      if (cs.deleted == null)
        temp[cs.id] = cs;
      else
        delete temp[cs.id];
    });
    this.caseFileTypes.next(temp);
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
    Object.values(cases).forEach((c) => {
      if (c.parentid == null) {
        rootcases.push(c.id);
        if (casechilds[c.id] == undefined)
          casechilds[c.id] = [];
      } else {
        if (casechilds[c.parentid] == undefined)
          casechilds[c.parentid] = [];
        casechilds[c.parentid].push(c.id);
      }
    });
    rootcases.sort((a, b) => cases[a].title > cases[b].title ? 1 : -1);
    this.caseChilds.next(casechilds);
    this.caseRoots.next(rootcases);
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
    let temp = { ...this.contactTypes.value };
    contacttypes.forEach((a) => this._updateCommon(temp, a));
    this.contactTypes.next(temp);
  }

  private updateCountries(countries: Country[]) {
    this.countries.next(countries);
  }

  private updateCurrencies(currencies: Currency[]) {
    this.currencies.next(currencies);
  }

  private updateWorkCustomers(customers: WorkCustomer[]) {
    let temp = { ...this.workCustomers.value };
    customers.forEach((a) => this._updateCommon(temp, a));
    this.workCustomers.next(temp);
  }

  private updateWorkLeads(leads: WorkLead[]) {
    let temp = { ...this.workLeads.value };
    leads.forEach((a) => this._updateCommon(temp, a));
    this.workLeads.next(temp);
  }

  private updateWorkProjects(items: WorkProject[]) {
    let temp = { ...this.workProjects.value };
    items.forEach((a) => this._updateCommon(temp, a));
    this.workProjects.next(temp);
  }

  private updateWorkOffCategories(items: WorkOffCategory[]) {
    let temp = { ...this.workOfftimeCategories.value };
    items.forEach((a) => this._updateCommon(temp, a));
    this.workOfftimeCategories.next(temp);
  }

  private updateWorkTimeCategories(items: WorkTimeCategory[]) {
    let temp = { ...this.workTimeCategories.value };
    items.forEach((a) => this._updateCommon(temp, a));
    this.workTimeCategories.next(temp);
  }

  private updateNotes(notes: Note[]) {
    let temp = { ...this.notepadItems.value };
    notes.forEach((n) => {
      if (n.deldate == null)
        temp[n.id] = n;
      else
        delete temp[n.id];
    });
    this.notepadItems.next(temp);
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

  private updateTags(tags: Tag[]) {
    let temp = { ...this.tags.value };
    tags.forEach((a) => this._updateCommon(temp, a));
    this.tags.next(temp);
  }

  updateBankAccounts(obj: BankAccount[]) {
    let temp = { ...this.bankAccounts.value };
    obj.forEach((a) => this._updateCommon(temp, a));
    this.bankAccounts.next(temp);
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
      'customer', Object.values(this.workCustomers.value), subject, (c: WorkCustomer[]) => this.updateWorkCustomers(c));
    return subject;
  }

  updateExpenseCategories(obj: ExpenseCategory[]) {
    let temp = { ...this.expenseCategories.value };
    obj.forEach((a) => this._updateCommon(temp, a));
    this.expenseCategories.next(temp);
  }

  updateExpenseTypes(obj: ExpenseType[]) {
    let temp = { ...this.expenseTypes.value };
    obj.forEach((a) => this._updateCommon(temp, a));
    this.expenseTypes.next(temp);
  }

  updateNote(note: Note): BehaviorSubject<Note | null | boolean> {
    let subject = new BehaviorSubject<Note | null | boolean>(null);
    this.postCommon(note.id == 0 ? 'create' : 'update', note,
      'note', Object.values(this.notepadItems.value), subject, (n: Note[]) => this.updateNotes(n));
    return subject;
  }

  updateRole(roleitem: PartyRole): BehaviorSubject<PartyRole | null> {
    let subject = new BehaviorSubject<PartyRole | null>(null);
    //this.postCommon(roleitem.id == 0 ? 'create' : 'update', roleitem,
    //  'role', this.roles.value, subject, (c: PartyRole[]) => this.updateRoles(c));
    return subject;
  }

  updateSepaMandates(mandates: SepaMandate[]) {
    let temp = { ...this.sepaMandates.value };
    mandates.forEach((a) => this._updateCommon(temp, a));
    this.sepaMandates.next(temp);
  }

  updateSettings(settings: UserSettings, push: boolean = false) {
    this.settings.next(settings);
    if (push) {
      let url = this.configService.config.api.baseUrl + '/user/settings';
      this.authService.updateApi(url, { userSettings: settings });
    }
  }

  updateStocks(obj: Stock[]) {
    let temp = { ...this.stocks.value };
    obj.forEach((a) => this._updateCommon(temp, a));
    this.stocks.next(temp);
  }

  updateStocksApis(obj: StockApi[]) {
    let temp = { ...this.stocksApis.value };
    obj.forEach((a) => this._updateCommon(temp, a));
    this.stocksApis.next(temp);
  }

  updateTag(tag: Tag): BehaviorSubject<Tag | null> {
    let subject = new BehaviorSubject<Tag | null>(null);
    this.postCommon(tag.id == 0 ? 'create' : 'update', tag,
      'tags', Object.values(this.tags.value), subject, (c: Tag[]) => this.updateTags(c));
    return subject;
  }

  updateUser(user: User, push: boolean = false) {
    this.user.next(user);
    this.updateSettings(user.settings, push);
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
  version: number;
}

export interface ClientSettings {
  casesettings: ClientCaseSettings
}

export interface ClientCaseSettings {
  showCasesInDeletion: boolean;
  showCasesInRetention: boolean;
}

export interface CommonProperty {
  deleted: string | null;
  id: number;
}

export interface FinanceResponse {
  accounts: BankAccount[];
  countries: Country[];
  currencies: Currency[];
  expenseCategories: ExpenseCategory[];
  expenseTypes: ExpenseType[];
  sepaMandates: SepaMandate[];
  stocks: Stock[];
  stocksApis: StockApi[];
}

export interface FinanceStorage {
  bankAccounts: BankAccount[];
  countries: Country[];
  currencies: Currency[];
  expenseCategories: ExpenseCategory[];
  expenseTypes: ExpenseType[];
  sepaMandates: SepaMandate[];
  stocks: Stock[];
  stocksApis: StockApi[];
  ts: number;
  version: number;
}

export interface NotepadResponse {
  notes: Note[];
}

export interface NotepadStorage {
  notes: Note[];
  ts: number;
  version: number;
}

export interface NotificationsResponse {
  items: ServerNotification[];
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
  version: number;
}

export interface TagsResponse {
  tags: Tag[];
}

export interface TagsStorage {
  tags: Tag[];
  ts: number;
  version: number;
}

export interface UserSettingsStorage {
  user: User;
  version?: number;
}

export interface WorkResponse {
  customers: WorkCustomer[];
  leads: WorkLead[];
  offCategories: WorkOffCategory[];
  projects: WorkProject[];
  timeCategories: WorkTimeCategory[];
}

export interface WorkStorage {
  customers: WorkCustomer[];
  leads: WorkLead[];
  offCategories: WorkOffCategory[];
  projects: WorkProject[];
  timeCategories: WorkTimeCategory[];
  ts: number;
  version: number;
}
