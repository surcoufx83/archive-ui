import { Currency } from "./account/account";
import { TaxRate } from "./finance/finance";

export interface Address {
  id: number;
  city: string;
  created: string;
  deleted: string|null;
  department: string;
  firstnames: string;
  houseno: string
  lastnames: string;
  modified: string;
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
  created: string;
  deleted: string|null;
  i18nname: string;
  icon: string;
  modified: string;
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
  taxrates: TaxRate[];
}

export interface Party {
  id: number;
  city: string;
  created: string;
  deleted: string|null;
  department: string;
  iban: string;
  isbank: boolean;
  isclient: boolean;
  modified: string;
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
  created: string;
  deleted: string|null;
  modified: string;
  partyid: number;
  typeid: number;
  value: string;
}

export interface PartyRole {
  id: number;
  created: string;
  deleted: string|null;
  modified: string;
  name: string;
  i18nname: string;
}