import { HttpStatusCode } from "@angular/common/http";

export interface Address {
  id: number;
  city: string;
  created: string;
  deleted: string | null;
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

export interface ApiReply {
  success: boolean;
  errno?: number;
  error?: string;
  etag?: string;
  payload?: { [key: string]: string | any; };
  redirect?: boolean;
  redirectTo?: string;
  status: HttpStatusCode;
}

export interface BankAccount {
  id: number;
  accountno: string;
  bank: Party;
  bankid: number;
  bic: string;
  case: Case;
  caseid: number;
  client: Party;
  clientid: number;
  created: string;
  currency: Currency;
  currencyid: number;
  deleted: string | null;
  iban: string;
  title: string;
  updated: string;
}

export enum ButtonType {
  Ok,
  Cancel
}
export interface Case {
  id: number;
  casepath: string;
  childs: Case[];
  clientid: number | null;
  comment: string;
  created: string;
  deleted: string | null;
  directoryid: number | null;
  extid: string;
  files: File[];
  filescount: number;
  followupcaseid: number | null;
  issub: boolean;
  modified: string;
  notification: CaseNotification;
  parentid: number | null;
  partyid: number | null;
  period: CasePeriod;
  search1: string;
  search2: string;
  search3: string;
  statusid: number;
  taxyear: number | null;
  title: string;
  typeid: number
}

export interface CaseNotification {
  forecast: boolean;
  upcoming: boolean;
}

export interface CasePeriod {
  end: string | null;
  minperiod: Duration | null;
  minperiodFullfilled: boolean;
  period: Duration | null;
  renewal: CasePeriodRenewal;
  start: string | null;
  terminationperiod: Duration | null;
}

export interface CasePeriodRenewal {
  after: Duration | null;
  enabled: boolean;
  nextdate: string | null;
  period: Duration | null;
}

export interface CaseStatus {
  created: string;
  deleted: string | null;
  flag: string;
  flags: CaseStatusFlags;
  followup: CaseStatusFollowUp;
  icon: string;
  iconcolor: string;
  id: number;
  modified: string;
  name: string;
}

export interface CaseStatusFlags {
  active: boolean;
  cancelled: boolean;
  created: boolean;
  deleted: boolean;
  deletion: boolean;
  expired: boolean;
  hidden: boolean;
}

export interface CaseStatusFollowUp {
  status: number | null;
  autoswitch: boolean;
  period: Duration | null;
}

export interface CaseType {
  created: string;
  deleted: string | null;
  icon: string;
  id: number;
  modified: string;
  name: string;
}

export interface Class {
  description: string;
  email: string;
  id: number;
  isdefault: boolean;
  name: string;
  namepattern: string;
  techname: string;
}

export interface ContactType {
  id: number;
  created: string;
  deleted: string | null;
  i18nname: string;
  icon: string;
  modified: string;
  name: string;
}

export interface Country {
  id: number;
  currency: Currency | null;
  currencyid: number | null;
  i18nname: string;
  name: string;
  key2: string;
  key3: string;
  isdefault: boolean;
  taxrates: TaxRate[];
}

export interface Currency {
  id: number;
  isdefault: boolean;
  name: string;
  shortname: string;
  sign: string;
}

export interface Directory {
  id: number;
  parent: Directory | null;
  parentid: number | null;
  name: string;
  relpath: string;
  isroot: boolean;
  islink: boolean;
  mtime: string;
  deldate: string | null;
}

export interface ExpenseCategory {
  id: number;
  created: string;
  deleted: string | null;
  icon: string;
  name: string;
  parentid: number | null;
  search: Search5Phrases;
  updated: string;
  xtractname: string;
}

export interface ExpenseType {
  id: number;
  created: string;
  deleted: string | null;
  name: string;
  search: Search5Phrases;
  updated: string;
}

export interface Extension {
  id: number;
  convert: ExtensionConversion;
  displayable: boolean;
  downloadable: boolean;
  ext: string;
  indexable: boolean;
  meta: ExtensionMeta;
  mimetype: string;
  mimetypemeta: Mimetype | null;
  phpoffice: boolean;
}

export interface ExtensionConversion {
  gscommand: string;
  ocrcommand: string;
  returnImg: boolean;
  returnMimetype: string;
}

export interface ExtensionMeta {
  nocase: boolean;
  noclass: boolean;
}

export interface File {
  id: number;
  attributes: any;
  case: Case | null;
  caseid: number | null;
  case_filedescription: string | null;
  case_filename: string | null;
  case_filestatus: string | null;
  case_pintop: boolean;
  class: Class | null;
  classid: number | null;
  classifyDisabled: boolean;
  client: Party | null;
  clientid: number | null;
  contact: PartyContact | null;
  contactid: number | null;
  date: string;
  deldate: string | null;
  directory: Directory | null;
  directoryid: number | null;
  fileclass_meta: any;
  fileexists: boolean;
  hash: string;
  islink: boolean;
  istaxreceipt: boolean | null;
  mtime: string;
  name: string;
  partyaddress: Address | null;
  partyaddressid: number | null;
  relpath: string;
  size: number;
  tags: number[];
  taxyear: number | null;
  versions: { [key: number]: Version };
}

export interface Meter {
  id: number;
  caseid: number | null;
  notify: boolean;
  name: string;
  number: string;
  decimals: number;
  uom: string;
  expectedinterval: Duration;
  created: string;
  deleted: string | null;
  lastread: string | null;
  updated: string;
  readings: MeterReading[];
}

export interface MeterReading {
  id: number;
  meterid: number;
  value: number;
  date: string;
}

export interface Mimetype {
  id: number;
  icon: string;
  isCodefile: boolean;
  isExcelfile: boolean;
  isImagefile: boolean;
  isPdffile: boolean;
  isPowerpointfile: boolean;
  isTextfile: boolean;
  isWordfile: boolean;
  isZipfile: boolean;
  mimetype: string;
}

export interface Note {
  id: number;
  content: string;
  deldate: string | null;
  pinned: boolean;
  private: boolean;
  show: boolean;
  title: string;
  updated: string;
  variant: string;
}

export interface Page {
  id: number;
  versionid: number;
  pageno: number;
  pagetype: number;
  pagedata: string;
}

export interface Party {
  id: number;
  city: string;
  created: string;
  deleted: string | null;
  department: string;
  iban: string;
  isbank: boolean;
  isclient: boolean;
  key: string;
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
  deleted: string | null;
  modified: string;
  partyid: number;
  typeid: number;
  value: string;
}

export interface PartyRole {
  id: number;
  created: string;
  deleted: string | null;
  modified: string;
  name: string;
  i18nname: string;
}

export interface PhpDateTime {
  date: string;
  timezone: string;
  timezone_type: number;
}

export interface Receipt {
  id: number;
  currency: Currency
  currencyid: number;
  client: Party | null;
  clientid: number | null;
  party: Party | null;
  partyid: number | null;
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
  taxrateid: number | null;
  name: string;
  search: string;
  ean: string;
  organic: boolean;
  sort: string;
  icon: string | null;
}

export interface ReceiptArticleCategory {
  id: number;
  parent: ReceiptArticleCategory | null;
  parentid: number | null;
  name: string;
  sort: string;
  icon: string | null;
}

export interface ReceiptItem {
  id: number;
  receiptid: number;
  articleid: number | null;
  singleprice: number;
  quantity: number;
  discount: number;
  deposit: number;
  totalnet: number;
}

export interface RecentBooking {
  count: number;
  customerid: number;
  description: string;
  projectid: number | null;
  projectstage: string;
  timecategoryid: number;
}

export interface Search5Phrases {
  phrase1: string | null;
  phrase2: string | null;
  phrase3: string | null;
  phrase4: string | null;
  phrase5: string | null;
}

export interface SepaMandate {
  id: number;
  amounts: SepaMandateAmounts;
  created: string;
  deleted: string | null;
  description: string;
  references: SepaMandateReferences;
  search: string | null;
  sepa: SepaMandateData;
  terminated: string | null;
  updated: string;
}

export interface SepaMandateAmounts {
  gross: number | null;
  net: number | null;
  tax: number | null;
}

export interface SepaMandateReferences {
  account: number;
  case: number;
  category: number;
  client: number;
  currency: number;
  party: number;
}

export interface SepaMandateData {
  creditoridno: string;
  reference: string;
}

export interface ServerNotification {
  id: number;
  created: string;
  read: string | null;
  refdata: string | null;
  refid: number | null;
  type: string;
  updated: string;
  userid: number;
}

export interface Session {
  token: string;
  username: string;
}

export interface StandingOrder {

}

export interface Stock {
  id: number;
  api: number | null;
  bought: StockBought;
  created: string;
  currency: number;
  current: StockCurrent;
  deleted: string | null;
  iscrypto: boolean;
  isin: string;
  lastcheck: string | null;
  name: string;
  ordercount: number;
  symbol: string | null;
  updated: string;
  wkn: string;
}

export interface StockApi {
  id: number;
  created: string;
  deleted: string | null;
  name: string;
  token: string;
  updated: string;
  url: string;
}

export interface StockBought {
  quantity: number;
  value: number;
}

export interface StockCurrent {
  date: string | null;
  dif: StockDif;
  rate: number;
  value: number;
}

export interface StockDif {
  abs: number;
  rel: number;
}

export interface Tag {
  id: number;
  created: string;
  deleted: string | null;
  modified: string;
  value: string;
}

export interface TaxRate {
  id: number;
  rate: number;
  validfrom: string | null;
  validuntil: string | null;
}

export interface User {
  id: number;
  clients: UserClients,
  enabled: boolean;
  email: string;
  groups: UserGroup[];
  loginname: string;
  settings: UserSettings;
}

export interface UserClients {
  other: Party[];
  primary: Party | null;
}

export interface UserGroup {
  id: number;
  created: string;
  grant_access: boolean;
  groupname: string;
  updated: string;
}

export interface UserSettings {
  view: UserViewSettings;
  work: UserWorkSettings;
}

export interface UserViewSettings {
  calendar: UserCalendarViewSettings;
  lists: UserListViewSettings;
}

export interface UserCalendarViewSettings {
  asList: boolean;
  firstDayOfWeek: number;
  showWeek: boolean;
  showWeekend: boolean;
}

export interface UserListViewSettings {
  length: number;
}

export interface UserWorkSettings {
  leads: UserWorkLeadsSettings;
  livetracking: UserLiveTrackingSettings;
  tracking: UserTrackingSettings;
  worktime: UserWorkTimeSettings;
}

export interface UserWorkLeadsSettings {
  enabled: boolean;
}

export interface UserWorkTimeSettings {
  default: number;
  holidays: number;
  other: number;
  weekend: number;
}

export interface UserLiveTrackingSettings {
  enabled: boolean;
  rounding: number;
  roundmode: any | null;
}

export interface UserTrackingSettings {
  trackCustomer: boolean;
  trackCustomerProject: boolean;
  trackProjectTask: boolean;
  projectNameInDescription: boolean;
}

export interface Version {
  id: number;
  fileid: number;
  num: number;
  created: string;
  indexed: string | null;
  hasocr: boolean;
  ext: Extension | null;
  extid: number | null;
  pages: { [key: number]: Page } | null;
  words: { [key: string]: number } | null;
  stats: VersionStats | null;
}

export interface VersionStats {
  wordcount: number;
  votedWordcount: number;
}

export interface WarehouseItem {
  id: number;
  created: string;
  deleted: string | null;
  description: string;
  externalUrl: string;
  fixed: WarehouseItemFixedLocation;
  icon: string;
  name: string;
  order: number;
  spaceid: number;
  updated: string;
}

export interface WarehouseItemFixedLocation {
  col: number;
  row: number;
}

export interface WarehouseRoom {
  id: number;
  allwaysopen: boolean;
  created: string;
  deleted: string | null;
  icon: string;
  name: string;
  order: number;
  spaces: number[];
  updated: string;
  urlname: string;
}

export interface WarehouseSpace {
  id: number;
  children: number[];
  created: string;
  deleted: string | null;
  fixed: WarehouseSpaceFixedLayout | null;
  fullkey: string;
  icon: string;
  items?: WarehouseSpaceItems;
  key: string;
  layout: string;
  level: number;
  name: string;
  order: number;
  parentid: number | null;
  roomid: number;
  updated: string;
}

export interface WarehouseSpaceFixedLayout {
  cols: number;
  rows: number;
}

export interface WarehouseSpaceItems {
  default: WarehouseItem[];
  fixed: { [key: string]: WarehouseItem };
  fixedCols?: number[];
  fixedRows?: number[];
}

export interface WorkCalendarColor {
  primary: string;
  secondary: string;
}

export interface WorkCustomer {
  created: string;
  deleted: string | null;
  disabled: boolean;
  id: number;
  lastusage: string | null;
  modified: string;
  name: string;
  userid: number;
}

export interface WorkDay {
  bookings: { [key: number]: WorkDayBooking } | null;
  date: string;
  day: number;
  holiday: WorkHoliday | null;
  holidayid: number | null;
  id: number;
  month: WorkMonth;
  monthid: number;
  note: string;
  offcategory: WorkOffCategory | null;
  offcategoryid: number | null;
  stats: WorkDayStats | null;
  daytimeStats?: WorkDayTimeStats;
}

export interface WorkDayBooking {
  break: number;
  customer: WorkCustomer | null;
  customerid: number | null;
  dayid: number;
  description: string;
  duration: number;
  id: number;
  project: WorkProject | null;
  projectid: number | null;
  projectstage: string;
  timecategory: WorkTimeCategory;
  timecategoryid: number;
  timefrom: string;
  timeuntil: string;
}

export interface WorkDayStats {
  avgduration: number;
  bookings: number;
  break: number;
  categories: number;
  categorylist: number[];
  customerlist: number[];
  customers: number;
  dayid: number;
  duration: number;
  maxduration: number;
  minduration: number;
  projectlist: number[];
  projects: number;
}

export interface WorkDayTimeStats {
  startOfDay: string;
  endOfDay: string;
  totalDurationWithoutBreaks: number;
  totalDurationWithBreaks: number;
  breaksDuration: number;
}

export interface WorkHoliday {
  daysAfterEaster: number | null;
  fixdate: string | null;
  fixmd: string | null;
  id: number;
  name: string;
  userid: number;
}

export interface WorkLead {
  id: number;
  completed: boolean;
  created: string;
  date_accepted: null | string;
  date_completed: null | string;
  date_reported: string;
  deleted: string | null;
  cpo: WorkLeadCpo;
  customer: null | WorkCustomer;
  customerid: null | number;
  customer_name: string;
  incentive: WorkLeadIncentive;
  lead: WorkLeadLead;
  paid: boolean;
  party: null | Party;
  partyid: null | number;
  products: string;
  project_name: string;
  project_description: string;
  sales: string;
  updated: string;
  userid: number;
}

export interface WorkLeadCpo {
  cpo_projectno: string;
  cpo_projectname: string;
}

export interface WorkLeadIncentive {
  isincentive: boolean;
  incentive_completed: boolean;
  incentive_gross_value: number;
  incentive_net_value: number;
  incentive_paid: null | string;
  incentive_splitfactor: number;
  incentive_value: number;
}

export interface WorkLeadLead {
  islead: boolean;
  lead_no: string;
  lead_text: string;
  opp_no: string;
  state: string;
  contract_value: number;
  lead_gross_value: number;
  lead_net_value: number;
  lead_paid: null | string;
  lead_completed: boolean;
}

export interface WorkMonth {
  datefrom: string;
  dateuntil: string;
  days: number;
  holidays: number;
  id: number;
  month: number;
  timeclose: number;
  timedif: number;
  timestart: number;
  updated: string;
  userid: number;
  weekenddays: number;
  year: number;
  uiCreating?: boolean;
}

export interface WorkOffCategory {
  calendarcolor: WorkCalendarColor;
  created: string;
  deleted: string | null;
  icon: string;
  iconcolor: string;
  id: number;
  name: string;
  quickselect: boolean;
  rowcolor: string;
  updated: string;
  userid: number;
}

export interface WorkProject {
  created: string;
  customer: WorkCustomer;
  customerid: number;
  deleted: string | null;
  disabled: boolean;
  id: number;
  lastusage: string | null;
  name: string;
  updated: string;
  userid: number;
}

export interface WorkTimeCategory {
  calendarcolor: WorkCalendarColor;
  created: string;
  deleted: string | null;
  icon: string;
  iconcolor: string;
  id: number;
  name: string;
  rowcolor: string;
  updated: string;
  userid: number;
}
