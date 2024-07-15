import { Environment } from './types';

export const defaultEnvironment: Environment = {
  production: false,
  api: {
    baseUrl: '/api',
    auth: {
      checkUrl: '/api/auth/check',
      loginUrl: '/api/auth/login',
      oauth2Providers: {}
    }
  },
  icons: {
    account: 'fa-solid fa-user',
    add: 'fa-solid fa-plus',
    bankAccount: 'fa-solid fa-wallet',
    busy: 'fa-solid fa-fan fa-spin',
    calendar: 'fa-solid fa-calendar-days',
    cases: 'fa-solid fa-file-signature',
    check: 'fa-regular fa-square-check',
    'check-no': 'fa-regular fa-square',
    copy: 'fa-solid fa-copy',
    class: 'fa-solid fa-fingerprint',
    close: 'fa-solid fa-xmark',
    cloud: 'fa-brands fa-cloudversify',
    contacttype: 'fa-regular fa-address-card',
    country: 'fa-solid fa-globe',
    crypto: 'fa-solid fa-bitcoin-sign',
    currency: 'fa-solid fa-coins',
    dashboard: 'fa-solid fa-chart-pie',
    database: 'fa-solid fa-database',
    delete: 'fa-solid fa-trash',
    download: 'fa-solid fa-cloud-arrow-down',
    dragAndDrop: 'fa-solid fa-arrow-down-up-lock',
    drop: 'fa-solid fa-arrows-down-to-line',
    edit: 'fa-solid fa-pen',
    error: 'fa-solid fa-triangle-exclamation',
    file: 'fa-solid fa-file',
    'filter-price': 'fa-solid fa-filter-circle-dollar',
    finance: 'fa-regular fa-money-bill-alt',
    fingerprint: 'fa-solid fa-fingerprint',
    folder: 'fa-solid fa-folder',
    'folder-up': 'fa-solid fa-turn-up fa-flip-horizontal',
    'go-down': 'fa-solid fa-caret-down',
    'go-left': 'fa-solid fa-caret-left',
    'go-right': 'fa-solid fa-caret-right',
    'go-up': 'fa-solid fa-caret-up',
    goto: 'fa-solid fa-arrow-up-right-from-square',
    grid: 'fa-solid fa-grip',
    help: 'fa-regular fa-circle-question',
    hide: 'fa-regular fa-eye-slash',
    home: 'fa-solid fa-handshake-simple',
    info: 'fa-solid fa-info-circle',
    leads: 'fa-solid fa-funnel-dollar',
    list: 'fa-solid fa-grip-lines',
    lists: 'fa-solid fa-list-check',
    listUl: 'fa-solid fa-list-ul',
    listOl: 'fa-solid fa-list-ol',
    listCb: 'fa-solid fa-list-check',
    locale: 'fa-solid fa-language',
    login: 'fa-solid fa-user-lock',
    logout: 'fa-solid fa-power-off',
    menu: 'fa-solid fa-bars',
    meter: 'fa-solid fa-gauge',
    'meter-reading': 'fa-solid fa-gauge-simple',
    moveUpDown: 'fa-solid fa-up-down',
    'moving-boxes': 'fa-solid fa-people-carry-box',
    notepad: 'fa-regular fa-lightbulb',
    organic: 'fa-solid fa-seedling',
    report: 'fa-solid fa-file-arrow-down',
    pin: 'fa-solid fa-map-pin',
    preview: 'fa-solid fa-eye',
    receipt: 'fa-solid fa-receipt',
    role: 'fa-solid fa-user-shield',
    'rotate-left': 'fa-solid fa-rotate-left',
    save: 'fa-solid fa-cloud-arrow-up',
    search: 'fa-brands fa-searchengin',
    show: 'fa-regular fa-eye',
    settings: 'fa-solid fa-cog',
    shopping: 'fa-solid fa-cart-shopping',
    sortasc: 'fa-solid fa-arrow-down-a-z',
    sortdesc: 'fa-solid fa-arrow-down-z-a',
    spinner: 'fa-solid fa-spinner',
    star: 'fa-solid fa-star',
    'step-next': 'fa-solid fa-forward-step',
    stocks: 'fa-solid fa-money-bills',
    stopwatch: 'fa-solid fa-stopwatch',
    tag: 'fa-solid fa-tag',
    taxes: 'fa-solid fa-stamp',
    taxrate: 'fa-solid fa-scale-balanced',
    today: 'fa-solid fa-calendar-day',
    'toggle-off': 'fa-solid fa-toggle-off',
    'toggle-on': 'fa-solid fa-toggle-on',
    travel: 'fa-solid fa-car-side',
    warehouse: 'fa-solid fa-boxes-stacked',
    wine: 'fa-solid fa-wine-bottle',
    work: 'fa-solid fa-laptop-house',
    year: 'fa-solid fa-calendar-alt',
    x: 'fa-solid fa-x'
  },
  l10n: {
    fallbackLocale: 'en'
  },
  navigation: {
    navbarBarItems: [
      {
        title: 'navbar.items.home',
        icon: 'home',
        link: '/home'
      },
      {
        title: 'navbar.items.cases',
        icon: 'cases',
        link: '/cases'
      },
      {
        title: 'navbar.items.finance',
        icon: 'finance',
        link: '/finance'
      },
      {
        title: 'navbar.items.notepad',
        icon: 'notepad',
        link: '/notepad'
      },
      {
        title: 'navbar.items.lists',
        icon: 'lists',
        link: '/lists'
      },
      {
        title: 'navbar.items.work',
        icon: 'work',
        link: '/work'
      }
    ],
    navbarDropdownItems: [
      {
        title: 'navbar.user.clearCacheLink',
        icon: 'x',
        callFn: 'clearCache'
      },
      {
        divider: true
      },
      {
        title: 'navbar.user.logoutLink',
        icon: 'logout',
        link: '/logout'
      }
    ],
    financeBarItems: [
      {
        title: 'navbar.finance.accounts',
        icon: 'bankAccount',
        link: '/finance/accounts'
      },
      {
        title: 'navbar.finance.stocks',
        icon: 'stocks',
        link: '/finance/stocks'
      }
    ],
    workBarItems: [
      {
        title: 'navbar.workitems.today',
        icon: 'today',
        link: '/work/today',
        matchLink: '/work/day'
      },
      {
        title: 'navbar.workitems.month',
        icon: 'calendar',
        link: '/work/month',
        matchLink: '/work/month'
      },
      {
        title: "navbar.workitems.year",
        icon: "year",
        link: "/work/year",
        matchLink: "/work/year"
      },
      {
        title: "navbar.workitems.travel",
        icon: "travel",
        link: "/work/travel",
        matchLink: "/work/travel"
      }
    ]
  },
  localStoragePrefix: 'ArcApiv2__'
};
