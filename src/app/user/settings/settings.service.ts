import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  private filetypes: BehaviorSubject<CaseFiletype[]> = new BehaviorSubject<CaseFiletype[]>([]);
  filetypes$ = this.filetypes.asObservable();

  private parties: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]);
  parties$ = this.parties.asObservable();

  private roles: BehaviorSubject<PartyRole[]> = new BehaviorSubject<PartyRole[]>([]);
  roles$ = this.roles.asObservable();

  private settings: BehaviorSubject<Settings|null> = new BehaviorSubject<Settings|null>(null);
  settings$ = this.settings.asObservable();
  
  private user: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  user$ = this.user.asObservable();

  private workprops: BehaviorSubject<WorkProperties|null> = new BehaviorSubject<WorkProperties|null>(null);
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

  updateClass(classitem: Class) : BehaviorSubject<Class|null> {
    let subject = new BehaviorSubject<Class|null>(null);
    let url = this.configService.config.api.baseUrl + '/class/';
    if (classitem.id == 0)
      url += 'create';
    else
      url += classitem.id;
    this.authService.updateApi(url, {class: classitem}).subscribe((reply) => {
      if (reply.success && reply.payload && reply.payload['class']) {
        let newitem = <Class>reply.payload['class'];
        let classes = this.classes.value;
        if (classitem.id > 0) {
          let removei = -1;
          for (let i = 0; i < classes.length; i++) {
            if (classes[i].id == classitem.id) {
              removei = i;
              break;
            }
          }
          classes.splice(removei, 1, newitem);
        } else {
          classes.push(newitem);
        }
        if (newitem.isdefault) {
          classes.forEach((c) => {
            if (c.id != newitem.id && c.isdefault)
              c.isdefault = false;
          });
        }
        this.updateClasses(classes);
        subject.next(newitem);
        subject.complete();
      }
    });
    return subject;
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
