import { Currency } from "./account/account";

export interface Address {
  id: number;
  city: string;
  department: string;
  firstnames: string;
  houseno: string
  lastnames: string;
  name1: string;
  name2: string;
  partyid: number;
  search1: string;
  search2: string;
  search3: string;
  street: string;
  zip: string;
}

export enum ButtonType {
  Ok,
  Cancel
}

export interface ContactType {
  id: number;
  i18nname: string;
  icon: string;
  name: string;
}

export interface Country {
  id: number;
  currency: Currency|null;
  currencyid: number|null;
  i18nname: string;
  name: string;
  key2: string;
  key3: string;
  isdefault: boolean;
}

export interface Party {
  id: number;
  addresses: Address[];
  city: string;
  contacts: PartyContact[];
  department: string;
  iban: string;
  isbank: boolean;
  isclient: boolean;
  name1: string;
  name2: string;
  search1: string;
  search2: string;
  search3: string;
  street: string;
  vatno: string;
  vatregno: string;
  zip: string;
}

export interface PartyContact {
  id: number;
  partyid: number;
  typeid: number;
  value: string;
}

export interface PartyRole {
  id: number;
  name: string;
  i18nname: string;
}