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
  payload?: { [key: string]: string | any; };
  redirect?: boolean;
  redirectTo?: string;
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

export interface CaseFiletype {
  id: number;
  created: string;
  deleted: string | null;
  icon: string;
  iconcolor: string;
  modified: string;
  name: string;
  i18nname: string;
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

export interface Extension {
  id: number;
  displayable: boolean;
  downloadable: boolean;
  ext: string;
  indexable: boolean;
  mimetype: string;
}

export interface File {
  id: number;
  directory: Directory | null;
  directoryid: number | null;
  class: Class | null;
  classid: number | null;
  classifyDisabled: boolean;
  case: Case | null;
  caseid: number | null;
  case_filetype: CaseFiletype | null;
  case_filetypeid: number | null;
  client: Party | null;
  clientid: number | null;
  fileexists: boolean;
  partyaddress: Address | null;
  partyaddressid: number | null;
  contact: PartyContact | null;
  contactid: number | null;
  name: string;
  date: string;
  islink: boolean;
  mtime: string;
  size: number;
  hash: string;
  deldate: string | null;
  case_filename: string | null;
  case_filedescription: string | null;
  case_filestatus: string | null;
  case_pintop: boolean;
  fileclass_meta: any;
  relpath: string;
  attributes: any;
  istaxreceipt: boolean | null;
  taxyear: number | null;
  versions: { [key: number]: Version };
}

export interface Meter {
  id: number;
  caseid: number | null;
  notify: boolean;
  name: string;
  number: string;
  expectedinterval: Duration;
  created: string;
  deleted: string | null;
  lastread: string | null;
  updated: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  variant: string;
  updated: string;
  deldate: string | null;
  show: boolean;
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

export interface Session {
  token: string;
  username: string;
}

export interface StandingOrder {

}

export interface TaxRate {
  id: number;
  rate: number;
  validfrom: string | null;
  validuntil: string | null;
}

export interface User {
  id: number;
  enabled: boolean;
  email: string;
  loginname: string;
  settings: UserSettings;
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
  bookings: { [key: number]: WorkDayBooking };
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
  date_accepted: null | string;
  date_completed: null | string;
  date_reported: string;
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
}

export interface WorkOffCategory {
  calendarcolor: WorkCalendarColor;
  icon: string;
  iconcolor: string;
  id: number;
  name: string;
  quickselect: boolean;
  rowcolor: string;
  userid: number;
}

export interface WorkProject {
  created: string;
  customer: WorkCustomer;
  customerid: number;
  disabled: boolean;
  id: number;
  lastusage: string | null;
  name: string;
  userid: number;
}

export interface WorkProperties {
  customers: WorkCustomer[];
  leads: WorkLead[];
  offCategories: WorkOffCategory[];
  projects: WorkProject[];
  timeCategories: WorkTimeCategory[];
}

export interface WorkTimeCategory {
  calendarcolor: WorkCalendarColor;
  icon: string;
  iconcolor: string;
  id: number;
  name: string;
  rowcolor: string;
  userid: number;
}
