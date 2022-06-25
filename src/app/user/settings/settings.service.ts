import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from './settings';
import { AuthService } from '../../auth.service';
import { ConfigService } from '../../config.service';
import { WorkProperties } from '../../work/work';
import { User } from '../user';
import { Case, CaseFiletype } from 'src/app/cases/case';
import { Class } from 'src/app/files/class';
import { Address, ContactType, Country, Party, PartyContact, PartyRole } from 'src/app/common';
import { Currency } from 'src/app/account/account';
import { TaxRate } from 'src/app/finance/finance';

@Injectable()
export class SettingsService {

  private archiveLoaded: boolean = false;
  private componentRefresher: any;

  constructor(private authService: AuthService,
    private configService: ConfigService) {
    this.loadUserSettings();
  }

  public loadArchiveSettings(): void {
    if (this.archiveLoaded)
      return;
    this.archiveLoaded = true;
    let url = this.configService.config.api.baseUrl + '/common/props';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        this.updateAddresses(reply.payload['addresses']);
        this.updateCases(reply.payload['cases']);
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

  private cases: BehaviorSubject<Case[]> = new BehaviorSubject<Case[]>([]);
  cases$ = this.cases.asObservable();

  private caseFileStatus: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  caseFileStatus$ = this.caseFileStatus.asObservable();

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
    let obj: { [key:string]: any} = {};
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

  private updateAddresses(addresses: Address[]) {
    this.addresses.next(addresses);
  }

  private updateCases(cases: Case[]) {
    this.cases.next(cases);
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
