import { Currency } from "../account/account";
import { Country, Party } from "../common";

export interface Receipt {
    id: number;
    currency: Currency
    currencyid: number;
    client: Party|null;
    clientid: number|null;
    party: Party|null;
    partyid: number|null;
    date: string;
    net: number;
    tax1: number;
    tax2: number;
    tax3: number;
    tax1_net: number;
    tax2_net: number;
    tax3_net: number;
    tax1_amount: number;
    tax2_amount: number;
    tax3_amount: number;
    gross1: number;
    gross2: number;
    gross3: number;
    gross_total: number;
    items: ReceiptItem[];
}

export interface ReceiptArticle {
    id: number;
    category: ReceiptArticleCategory;
    categoryid: number;
    taxrateid: number|null;
    name: string;
    search: string;
    ean: string;
    organic: boolean;
    sort: string;
    icon: string|null;
}

export interface ReceiptArticleCategory {
    id: number;
    parent: ReceiptArticleCategory|null;
    parentid: number|null;
    name: string;
    sort: string;
    icon: string|null;
}

export interface ReceiptItem {
    id: number;
    receiptid: number;
    articleid: number|null;
    singleprice: number;
    quantity: number;
    discount: number;
    deposit: number;
    totalnet: number;
}

export interface TaxRate {
    id: number;
    country: Country;
    countryid: number;
    rate: number;
    validfrom: string|null;
    validuntil: string|null;
}