import { NavbarItem } from '../app/config.service';

export type Environment = {
    production: boolean,
    api: {
        baseUrl: string,
        auth: {
            checkUrl?: string,
            loginUrl: string,
            oauth2Providers: { [key: string]: EnvironmentOAuth2Provider }
        },
    },
    icons: { [key: string]: string },
    l10n: {
        fallbackLocale: 'de' | 'en' | 'fr',
    },
    navigation: {
        navbarBarItems: NavbarItem[],
        navbarDropdownItems: NavbarItem[],
        financeBarItems: NavbarItem[],
        workBarItems: NavbarItem[]
    },
    localStoragePrefix: string
}

export type EnvironmentOAuth2Provider = {
    baseUrl: string,
    clientId: string,
    clientSecret: string,
    state: string
};