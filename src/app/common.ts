
export interface Address {

}

export interface Client {
  
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

}