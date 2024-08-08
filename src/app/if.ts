import { HttpStatusCode } from "@angular/common/http";

export type Address = {
  id: number,
  city: string,
  created: string,
  deleted: string | null,
  department: string,
  firstnames: string,
  houseno: string
  lastnames: string,
  modified: string,
  name1: string,
  name2: string,
  partyid: number,
  search1: string,
  search2: string,
  search3: string,
  street: string,
  zip: string,
}

export type ApiReply = {
  success: boolean,
  errno?: number,
  error?: string,
  etag?: string,
  payload?: { [key: string]: string | any; },
  redirect?: boolean,
  redirectTo?: string,
  status: HttpStatusCode,
}

export type BankAccount = {
  id: number,
  accountno: string,
  bank: Party,
  bankid: number,
  bic: string,
  case: Case,
  caseid: number,
  client: Party,
  clientid: number,
  created: string,
  currency: Currency,
  currencyid: number,
  deleted: string | null,
  iban: string,
  title: string,
  updated: string,
}

export enum ButtonType {
  Ok,
  Cancel
}
export type Case = {
  id: number,
  casepath: string,
  childs: Case[],
  clientid: number | null,
  comment: string,
  created: string,
  deleted: string | null,
  directoryid: number | null,
  extid: string,
  files: File[],
  filescount: number,
  followupcaseid: number | null,
  issub: boolean,
  modified: string,
  notification: CaseNotification,
  parentid: number | null,
  partyid: number | null,
  period: CasePeriod,
  search1: string,
  search2: string,
  search3: string,
  statusid: number,
  taxyear: number | null,
  title: string,
  typeid: number
}

export type CaseNotification = {
  forecast: boolean,
  upcoming: boolean,
}

export type CasePeriod = {
  end: string | null,
  minperiod: Duration | null,
  minperiodFullfilled: boolean,
  period: Duration | null,
  renewal: CasePeriodRenewal,
  start: string | null,
  terminationperiod: Duration | null,
}

export type CasePeriodRenewal = {
  after: Duration | null,
  enabled: boolean,
  nextdate: string | null,
  period: Duration | null,
}

export type CaseStatus = {
  created: string,
  deleted: string | null,
  flag: string,
  flags: CaseStatusFlags,
  followup: CaseStatusFollowUp,
  icon: string,
  iconcolor: string,
  id: number,
  modified: string,
  name: string,
}

export type CaseStatusFlags = {
  active: boolean,
  cancelled: boolean,
  created: boolean,
  deleted: boolean,
  deletion: boolean,
  expired: boolean,
  hidden: boolean,
}

export type CaseStatusFollowUp = {
  status: number | null,
  autoswitch: boolean,
  period: Duration | null,
}

export type CaseType = {
  created: string,
  deleted: string | null,
  icon: string,
  id: number,
  modified: string,
  name: string,
}

export type Class = {
  description: string,
  email: string,
  id: number,
  isdefault: boolean,
  name: string,
  namepattern: string,
  techname: string,
}

export type ContactType = {
  id: number,
  created: string,
  deleted: string | null,
  i18nname: string,
  icon: string,
  modified: string,
  name: string,
}

export type Country = {
  id: number,
  currency: Currency | null,
  currencyid: number | null,
  i18nname: string,
  name: string,
  key2: string,
  key3: string,
  isdefault: boolean,
  taxrates: TaxRate[],
}

export type Currency = {
  id: number,
  isdefault: boolean,
  name: string,
  shortname: string,
  sign: string,
}

export type Directory = {
  id: number,
  parent: Directory | null,
  parentid: number | null,
  name: string,
  relpath: string,
  isroot: boolean,
  islink: boolean,
  mtime: string,
  deldate: string | null,
}

export type ExpenseCategory = {
  id: number,
  created: string,
  deleted: string | null,
  icon: string,
  name: string,
  parentid: number | null,
  search: Search5Phrases,
  updated: string,
  xtractname: string,
}

export type ExpenseType = {
  id: number,
  created: string,
  deleted: string | null,
  name: string,
  search: Search5Phrases,
  updated: string,
}

export type Extension = {
  id: number,
  convert: ExtensionConversion,
  displayable: boolean,
  downloadable: boolean,
  ext: string,
  indexable: boolean,
  meta: ExtensionMeta,
  mimetype: string,
  mimetypemeta: Mimetype | null,
  phpoffice: boolean,
}

export type ExtensionConversion = {
  gscommand: string,
  ocrcommand: string,
  returnImg: boolean,
  returnMimetype: string,
}

export type ExtensionMeta = {
  nocase: boolean,
  noclass: boolean,
}

export type File = {
  id: number,
  attributes: any,
  case: Case | null,
  caseid: number | null,
  case_filedescription: string | null,
  case_filename: string | null,
  case_filestatus: string | null,
  case_pintop: boolean,
  class: Class | null,
  classid: number | null,
  classifyDisabled: boolean,
  client: Party | null,
  clientid: number | null,
  contact: PartyContact | null,
  contactid: number | null,
  date: string,
  deldate: string | null,
  directory: Directory | null,
  directoryid: number | null,
  fileclass_meta: any,
  fileexists: boolean,
  hash: string,
  islink: boolean,
  istaxreceipt: boolean | null,
  mtime: string,
  name: string,
  partyaddress: Address | null,
  partyaddressid: number | null,
  relpath: string,
  size: number,
  tags: number[],
  taxyear: number | null,
  versions: { [key: number]: Version },
}

export type List = {
  checkedBelow: boolean,
  deleted: string | null,
  description: string,
  id: number,
  items: ListItem[],
  listStyle: 'ul' | 'ol' | 'cb',
  pinned: boolean,
  private: boolean,
  reset: null | { cron: string | null, selectedDate: string | null }
  title: string,
  updated: string,
  user: User,
}

export type ListItem = {
  checked: boolean,
  checkedBy: User | null,
  content: string,
}

export type Meter = {
  id: number,
  caseid: number | null,
  notify: boolean,
  name: string,
  number: string,
  decimals: number,
  uom: string,
  expectedinterval: Duration,
  created: string,
  deleted: string | null,
  lastread: string | null,
  updated: string,
  readings: MeterReading[],
}

export type MeterReading = {
  id: number,
  meterid: number,
  value: number,
  date: string,
}

export type Mimetype = {
  id: number,
  icon: string,
  isCodefile: boolean,
  isExcelfile: boolean,
  isImagefile: boolean,
  isPdffile: boolean,
  isPowerpointfile: boolean,
  isTextfile: boolean,
  isWordfile: boolean,
  isZipfile: boolean,
  mimetype: string,
}

export type Note = {
  id: number,
  content: string,
  deldate: string | null,
  pinned: boolean,
  private: boolean,
  show: boolean,
  title: string,
  updated: string,
  variant: string,
}

export type Page = {
  id: number,
  versionid: number,
  pageno: number,
  pagetype: number,
  pagedata: string,
}

export type Party = {
  id: number,
  city: string,
  created: string,
  deleted: string | null,
  department: string,
  iban: string,
  isbank: boolean,
  isclient: boolean,
  key: string,
  modified: string,
  name1: string,
  name2: string,
  search1: string,
  search2: string,
  search3: string,
  street: string,
  vatno: string,
  vatregno: string,
  zip: string,
}

export type PartyContact = {
  id: number,
  created: string,
  deleted: string | null,
  modified: string,
  partyid: number,
  typeid: number,
  value: string,
}

export type PartyRole = {
  id: number,
  created: string,
  deleted: string | null,
  modified: string,
  name: string,
  i18nname: string,
}

export type PhpDateTime = {
  date: string,
  timezone: string,
  timezone_type: number,
}

export type Receipt = {
  id: number,
  currency: Currency
  currencyid: number,
  client: Party | null,
  clientid: number | null,
  party: Party | null,
  partyid: number | null,
  date: string,
  net: number,
  tax1: number,
  tax2: number,
  tax3: number,
  tax1_net: number,
  tax2_net: number,
  tax3_net: number,
  tax1_amount: number,
  tax2_amount: number,
  tax3_amount: number,
  gross1: number,
  gross2: number,
  gross3: number,
  gross_total: number,
  items: ReceiptItem[],
}

export type ReceiptArticle = {
  id: number,
  category: ReceiptArticleCategory,
  categoryid: number,
  taxrateid: number | null,
  name: string,
  search: string,
  ean: string,
  organic: boolean,
  sort: string,
  icon: string | null,
}

export type ReceiptArticleCategory = {
  id: number,
  parent: ReceiptArticleCategory | null,
  parentid: number | null,
  name: string,
  sort: string,
  icon: string | null,
}

export type ReceiptItem = {
  id: number,
  receiptid: number,
  articleid: number | null,
  singleprice: number,
  quantity: number,
  discount: number,
  deposit: number,
  totalnet: number,
}

export type RecentBooking = {
  count: number,
  customerid: number,
  description: string,
  projectid: number | null,
  projectstage: string,
  timecategoryid: number,
}

export interface Search5Phrases {
  phrase1: string | null,
  phrase2: string | null,
  phrase3: string | null,
  phrase4: string | null,
  phrase5: string | null,
}

export type SepaMandate = {
  id: number,
  amounts: SepaMandateAmounts,
  created: string,
  deleted: string | null,
  description: string,
  references: SepaMandateReferences,
  search: string | null,
  sepa: SepaMandateData,
  terminated: string | null,
  updated: string,
}

export type SepaMandateAmounts = {
  gross: number | null,
  net: number | null,
  tax: number | null,
}

export type SepaMandateReferences = {
  account: number,
  case: number,
  category: number,
  client: number,
  currency: number,
  party: number,
}

export type SepaMandateData = {
  creditoridno: string,
  reference: string,
}

export type ServerNotification = {
  id: number,
  created: string,
  read: string | null,
  refdata: string | null,
  refid: number | null,
  type: string,
  updated: string,
  userid: number,
}

export type Session = {
  token: string,
  username: string,
}

export type StandingOrder = {
  id: number,
  account: BankAccount,
  accountid: number,
  accountto: BankAccount | null,
  accounttoid: number | null,
  amount: number,
  case: Case,
  caseid: number,
  category: ExpenseCategory | null,
  categoryid: number | null,
  client: User,
  clientid: number,
  created: string,
  description: string,
  dom: number,
  party: Party | null,
  partyid: number | null,
  search: string,
  terminated: string | null,
  updated: string,
  we_fw: boolean,
}

export type Stock = {
  id: number,
  api: number | null,
  bought: StockBought,
  created: string,
  currency: number,
  current: StockCurrent,
  deleted: string | null,
  iscrypto: boolean,
  isin: string,
  lastcheck: string | null,
  name: string,
  ordercount: number,
  symbol: string | null,
  updated: string,
  wkn: string,
}

export type StockApi = {
  id: number,
  created: string,
  deleted: string | null,
  name: string,
  token: string,
  updated: string,
  url: string,
}

export type StockBought = {
  quantity: number,
  value: number,
}

export type StockCurrent = {
  date: string | null,
  dif: StockDif,
  rate: number,
  value: number,
}

export type StockDif = {
  abs: number,
  rel: number,
}

export type Tag = {
  id: number,
  created: string,
  deleted: string | null,
  modified: string,
  value: string,
}

export type TaxRate = {
  id: number,
  rate: number,
  validfrom: string | null,
  validuntil: string | null,
}

export type User = {
  clients?: UserClients,
  email?: string,
  enabled?: boolean,
  groups?: UserGroup[],
  id: number,
  initials: string,
  loginname: string,
  names?: {
    first: string,
    full: string,
    last: string,
    middle: string,
  },
  settings?: UserSettings,
}

export type UserClients = {
  other: Party[],
  primary: Party | null,
}

export type UserGroup = {
  id: number,
  created: string,
  grant_access: boolean,
  groupname: string,
  updated: string,
}

export type UserSettings = {
  view: UserViewSettings,
  work: UserWorkSettings,
}

export type UserViewSettings = {
  calendar: UserCalendarViewSettings,
  lists: UserListViewSettings,
}

export type UserCalendarViewSettings = {
  asList: boolean,
  firstDayOfWeek: number,
  showWeek: boolean,
  showWeekend: boolean,
}

export type UserListViewSettings = {
  length: number,
}

export type UserWorkSettings = {
  leads: UserWorkLeadsSettings,
  livetracking: UserLiveTrackingSettings,
  tracking: UserTrackingSettings,
  worktime: UserWorkTimeSettings,
}

export type UserWorkLeadsSettings = {
  enabled: boolean,
}

export type UserWorkTimeSettings = {
  default: number,
  holidays: number,
  other: number,
  weekend: number,
}

export type UserLiveTrackingSettings = {
  enabled: boolean,
  rounding: number,
  roundmode: any | null,
}

export type UserTrackingSettings = {
  trackCustomer: boolean,
  trackCustomerProject: boolean,
  trackProjectTask: boolean,
  projectNameInDescription: boolean,
}

export type Version = {
  id: number,
  fileid: number,
  num: number,
  created: string,
  indexed: string | null,
  hasocr: boolean,
  ext: Extension | null,
  extid: number | null,
  pages: { [key: number]: Page } | null,
  words: { [key: string]: number } | null,
  stats: VersionStats | null,
}

export type VersionStats = {
  wordcount: number,
  votedWordcount: number,
}

export type WarehouseItem = {
  id: number,
  created: string,
  deleted: string | null,
  description: string,
  externalUrl: string,
  fixed: WarehouseItemFixedLocation,
  icon: string,
  name: string,
  order: number,
  spaceid: number,
  updated: string,
}

export type WarehouseItemFixedLocation = {
  col: number,
  row: number,
}

export type WarehouseRoom = {
  id: number,
  allwaysopen: boolean,
  created: string,
  deleted: string | null,
  icon: string,
  name: string,
  order: number,
  spaces: number[],
  updated: string,
  urlname: string,
}

export type WarehouseSpace = {
  id: number,
  children: number[],
  created: string,
  deleted: string | null,
  fixed: WarehouseSpaceFixedLayout | null,
  fullkey: string,
  icon: string,
  items?: WarehouseSpaceItems,
  key: string,
  layout: string,
  level: number,
  name: string,
  order: number,
  parentid: number | null,
  roomid: number,
  updated: string,
}

export type WarehouseSpaceFixedLayout = {
  cols: number,
  rows: number,
}

export type WarehouseSpaceItems = {
  default: WarehouseItem[],
  fixed: { [key: string]: WarehouseItem },
  fixedCols?: number[],
  fixedRows?: number[],
}

export type WorkCalendarColor = {
  primary: string,
  secondary: string,
}

export type WorkCustomer = {
  created: string,
  deleted: string | null,
  disabled: boolean,
  id: number,
  lastusage: string | null,
  modified: string,
  name: string,
  userid: number,
}

export type WorkDay = {
  bookings: { [key: number]: WorkDayBooking } | null,
  date: string,
  day: number,
  holiday: WorkHoliday | null,
  holidayid: number | null,
  id: number,
  month: WorkMonth,
  monthid: number,
  note: string,
  offcategory: WorkOffCategory | null,
  offcategoryid: number | null,
  stats: WorkDayStats | null,
  daytimeStats?: WorkDayTimeStats,
}

export type WorkDaySimple = {
  date: string,
  day: number,
  id: number,
  month: WorkMonth,
  monthid: number,
  note: string,
}

export type WorkDayTemplate = {
  content: {
    bookings: WorkDayBooking[],
    origin: WorkDaySimple,
  },
  created: string,
  deleted: string | null,
  flexItem: number,
  id: number,
  name: string,
  updated: string,
}

export type WorkDayBooking = {
  break: number,
  customer: WorkCustomer | null,
  customerid: number | null,
  dayid: number,
  description: string,
  duration: number,
  id: number,
  project: WorkProject | null,
  projectid: number | null,
  projectstage: string,
  timecategory: WorkTimeCategory,
  timecategoryid: number,
  timefrom: string,
  timeuntil: string,
}

export type WorkDayStats = {
  avgduration: number,
  bookings: number,
  break: number,
  categories: number,
  categorylist: number[],
  customerlist: number[],
  customers: number,
  dayid: number,
  duration: number,
  maxduration: number,
  minduration: number,
  projectlist: number[],
  projects: number,
}

export type WorkDayTimeStats = {
  startOfDay: string,
  endOfDay: string,
  totalDurationWithoutBreaks: number,
  totalDurationWithBreaks: number,
  breaksDuration: number,
}

export type WorkHoliday = {
  daysAfterEaster: number | null,
  fixdate: string | null,
  fixmd: string | null,
  id: number,
  name: string,
  userid: number,
}

export type WorkLead = {
  id: number,
  completed: boolean,
  created: string,
  date_accepted: null | string,
  date_completed: null | string,
  date_reported: string,
  deleted: string | null,
  cpo: WorkLeadCpo,
  customer: null | WorkCustomer,
  customerid: null | number,
  customer_name: string,
  incentive: WorkLeadIncentive,
  lead: WorkLeadLead,
  paid: boolean,
  party: null | Party,
  partyid: null | number,
  products: string,
  project_name: string,
  project_description: string,
  sales: string,
  updated: string,
  userid: number,
}

export type WorkLeadCpo = {
  cpo_projectno: string,
  cpo_projectname: string,
}

export type WorkLeadIncentive = {
  isincentive: boolean,
  incentive_completed: boolean,
  incentive_gross_value: number,
  incentive_net_value: number,
  incentive_paid: null | string,
  incentive_splitfactor: number,
  incentive_value: number,
}

export type WorkLeadLead = {
  islead: boolean,
  lead_no: string,
  lead_text: string,
  opp_no: string,
  state: string,
  contract_value: number,
  lead_gross_value: number,
  lead_net_value: number,
  lead_paid: null | string,
  lead_completed: boolean,
}

export type WorkMonth = {
  datefrom: string,
  dateuntil: string,
  days: number,
  holidays: number,
  id: number,
  month: number,
  timeclose: number,
  timedif: number,
  timestart: number,
  updated: string,
  userid: number,
  weekenddays: number,
  year: number,
  uiCreating?: boolean,
}

export type WorkOffCategory = {
  calendarcolor: WorkCalendarColor,
  created: string,
  deleted: string | null,
  icon: string,
  iconcolor: string,
  id: number,
  name: string,
  quickselect: boolean,
  rowcolor: string,
  updated: string,
  userid: number,
}

export type WorkProject = {
  created: string,
  customer: WorkCustomer,
  customerid: number,
  deleted: string | null,
  disabled: boolean,
  id: number,
  lastusage: string | null,
  name: string,
  updated: string,
  userid: number,
}

export type WorkTimeCategory = {
  calendarcolor: WorkCalendarColor,
  created: string,
  deleted: string | null,
  icon: string,
  iconcolor: string,
  id: number,
  name: string,
  rowcolor: string,
  travelIndicator: boolean,
  updated: string,
  userid: number,
}

export type WorkTravel = {
  amountTotal: number,
  city: string,
  country: Country,
  created: string,
  days: WorkTravelDay[],
  deleted: string | null,
  distanceTotal: number,
  expenses: WorkTravelExpense[],
  id: number,
  location: string,
  reason: string,
  timeEnd: string,
  timeStart: string,
  updated: string,
  user: User,
}

export type WorkTravelDay = {
  amount: number,
  date: string,
  fullDay: boolean,
  id: number,
  meals: {
    breakfast: boolean,
    dinner: boolean,
    lunch: boolean,
  }
}

export type WorkTravelExpense = {
  amount: number,
  description: string,
  id: number,
  type: string,
}
