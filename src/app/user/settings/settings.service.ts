import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Settings } from './settings';
import { AuthService } from '../../auth.service';
import { ConfigService } from '../../config.service';
import { WorkProperties } from '../../work/work';
import { User } from '../user';
import { Case, CaseFiletype } from 'src/app/cases/case';
import { Class } from 'src/app/files/class';
import { Address, ContactType, Party, PartyContact, PartyRole } from 'src/app/common';

@Injectable()
export class SettingsService {

  private archiveLoaded : boolean = false;

  constructor(private authService: AuthService,
              private configService: ConfigService)
  {
    this.loadUserSettings();
  }

  public loadArchiveSettings() : void {
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
        this.updateFiletypes(reply.payload['casefiletypes']);
        this.updateParties(reply.payload['parties']);
        this.updateRoles(reply.payload['roles']);
      }
    });
    this.caseFileStatus.next(['new', 'checked', 'approved']);
  }

  private loadUserSettings() : void {
    let url = this.configService.config.api.baseUrl + '/user/settings';
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success && reply.payload != null) {
        this.updateUser(<User>reply.payload['user']);
        this.updateWorkProps(<WorkProperties>reply.payload['work']);
      }
    });
  }

  private addresses: ReplaySubject<Address[]> = new ReplaySubject<Address[]>();
  addresses$ = this.addresses.asObservable();

  private cases: ReplaySubject<Case[]> = new ReplaySubject<Case[]>();
  cases$ = this.cases.asObservable();

  private caseFileStatus: ReplaySubject<string[]> = new ReplaySubject<string[]>();
  caseFileStatus$ = this.caseFileStatus.asObservable();

  private classes: ReplaySubject<Class[]> = new ReplaySubject<Class[]>();
  classes$ = this.classes.asObservable();

  private clients: ReplaySubject<Party[]> = new ReplaySubject<Party[]>();
  clients$ = this.clients.asObservable();

  private contacts: ReplaySubject<PartyContact[]> = new ReplaySubject<PartyContact[]>();
  contacts$ = this.contacts.asObservable();

  private contacttypes: ReplaySubject<ContactType[]> = new ReplaySubject<ContactType[]>();
  contacttypes$ = this.contacttypes.asObservable();

  private filetypes: ReplaySubject<CaseFiletype[]> = new ReplaySubject<CaseFiletype[]>();
  filetypes$ = this.filetypes.asObservable();

  private parties: ReplaySubject<Party[]> = new ReplaySubject<Party[]>();
  parties$ = this.parties.asObservable();

  private roles: ReplaySubject<PartyRole[]> = new ReplaySubject<PartyRole[]>();
  roles$ = this.roles.asObservable();

  private settings: ReplaySubject<Settings> = new ReplaySubject<Settings>();
  settings$ = this.settings.asObservable();
  
  private user: ReplaySubject<User> = new ReplaySubject<User>();
  user$ = this.user.asObservable();

  private workprops: ReplaySubject<WorkProperties> = new ReplaySubject<WorkProperties>();
  workprops$ = this.workprops.asObservable();

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

  private updateFiletypes(filetypes: CaseFiletype[]) {
    this.filetypes.next(filetypes);
  }

  private updateParties(parties: Party[]) {
    this.parties.next(parties);
  }

  private updateRoles(roles: PartyRole[]) {
    this.roles.next(roles);
  }

  updateSettings(settings: Settings, push: boolean = false) {
    this.settings.next(settings);
    if (push) {
      let url = this.configService.config.api.baseUrl + '/user/settings';
      this.authService.updateApi(url, {userSettings: settings});
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
      this.authService.updateApi(url, {workSettings: props});
    }
  }

}
