import { de, enUS } from "date-fns/locale";
import { Currency } from "../if";
import { FormatService } from "./format.service";

let mockcurrencyUSD: Currency = { id: 0, isdefault: false, name: 'US Dollar', shortname: 'USD', sign: '$' };
let mockcurrencyEUR: Currency = { id: 0, isdefault: false, name: 'Euro', shortname: 'EUR', sign: '€' };

function hash(s: string): string {
    let a: number[] = [];
    s.split('').forEach((l) => { a.push(l.charCodeAt(0)) });
    return `[${a.join(', ')}]`;
}

describe('FormatService', () => {

    let i18nServiceMockEnUs: any = jasmine.createSpyObj('I18nService', ['i18n'], { Locale: 'en', DateLocale: enUS });
    let i18nServiceMockDeDe: any = jasmine.createSpyObj('I18nService', ['i18n'], { Locale: 'de', DateLocale: de });
    let formatServiceEnUs: FormatService;
    let formatServiceDeDe: FormatService;

    beforeEach(() => {
        formatServiceEnUs = new FormatService(i18nServiceMockEnUs);
        formatServiceDeDe = new FormatService(i18nServiceMockDeDe);
    });

    it('should return the correct currrency string', () => {
        let tests = [
            { value: 0, expEnDol: '$0.00', expEnEur: '€0.00', expDeDol: '0,00 $', expDeEur: '0,00 €' },
            { value: -1, expEnDol: '-$1.00', expEnEur: '-€1.00', expDeDol: '-1,00 $', expDeEur: '-1,00 €' },
            { value: 1, expEnDol: '$1.00', expEnEur: '€1.00', expDeDol: '1,00 $', expDeEur: '1,00 €' },
            { value: .99, expEnDol: '$0.99', expEnEur: '€0.99', expDeDol: '0,99 $', expDeEur: '0,99 €' },
            { value: .999, expEnDol: '$1.00', expEnEur: '€1.00', expDeDol: '1,00 $', expDeEur: '1,00 €' },
            { value: -.999, expEnDol: '-$1.00', expEnEur: '-€1.00', expDeDol: '-1,00 $', expDeEur: '-1,00 €' },
            { value: 1001.99, expEnDol: '$1,001.99', expEnEur: '€1,001.99', expDeDol: '1.001,99 $', expDeEur: '1.001,99 €' },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.fcur(test.value, mockcurrencyUSD).replace(String.fromCharCode(160), ' ')).toBe(test.expEnDol);
            expect(formatServiceEnUs.fcur(test.value, mockcurrencyEUR).replace(String.fromCharCode(160), ' ')).toBe(test.expEnEur);
            expect(formatServiceDeDe.fcur(test.value, mockcurrencyUSD).replace(String.fromCharCode(160), ' ')).toBe(test.expDeDol);
            expect(formatServiceDeDe.fcur(test.value, mockcurrencyEUR).replace(String.fromCharCode(160), ' ')).toBe(test.expDeEur);
        });
    });

    it('should return the correct number string', () => {
        let tests = [
            { value: 0, fd: 0, md: 0, exp: '0' },
            { value: 1, fd: 0, md: 0, exp: '1' },
            { value: 1, fd: 1, md: 1, exp: '1.0' },
            { value: 1, fd: 2, md: 2, exp: '1.00' },
            { value: 1, fd: 0, md: 1, exp: '1' },
            { value: 1, fd: 0, md: 2, exp: '1' },
            { value: -1, fd: 0, md: 0, exp: '-1' },
            { value: -1, fd: 1, md: 1, exp: '-1.0' },
            { value: -1, fd: 2, md: 2, exp: '-1.00' },
            { value: -1, fd: 0, md: 1, exp: '-1' },
            { value: -1, fd: 0, md: 2, exp: '-1' },
            { value: .99, fd: 0, md: 0, exp: '1' },
            { value: .99, fd: 1, md: 1, exp: '1.0' },
            { value: .99, fd: 2, md: 2, exp: '0.99' },
            { value: .99, fd: 0, md: 1, exp: '1' },
            { value: .99, fd: 0, md: 2, exp: '0.99' },
            { value: .99, fd: 0, md: 3, exp: '0.99' },
            { value: .99, fd: 3, md: 3, exp: '0.990' },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.fnumber(test.value, test.fd, test.md).replace(String.fromCharCode(160), ' ')).toBe(test.exp);
        });
    });

    it('should return the correct filesize string', () => {
        let tests = [
            { value: 0, fd: 0, md: 0, exp: '0 B' },
            { value: 1, fd: 0, md: 0, exp: '1 B' },
            { value: 1000, fd: 0, md: 0, exp: '1,000 B' },
            { value: 1024, fd: 0, md: 0, exp: '1 KB' },
            { value: 1100, fd: 0, md: 1, exp: '1.1 KB' },
            { value: 1100, fd: 0, md: 2, exp: '1.07 KB' },
            { value: 1100, fd: 0, md: 3, exp: '1.074 KB' },
            { value: 1024, fd: 0, md: undefined, exp: '1 KB' },
            { value: 1100, fd: 0, md: undefined, exp: '1.074 KB' },
            { value: 1100, fd: 0, md: undefined, exp: '1.074 KB' },
            { value: 1100, fd: 0, md: undefined, exp: '1.074 KB' },
            { value: 1024, fd: 1, md: 1, exp: '1.0 KB' },
            { value: 1024, fd: 2, md: 2, exp: '1.00 KB' },
            { value: 1024, fd: 2, md: 4, exp: '1.00 KB' },
            { value: 2000, fd: 0, md: 0, exp: '2 KB' },
            { value: 10000, fd: 0, md: 0, exp: '10 KB' },
            { value: 1000000, fd: 0, md: 0, exp: '977 KB' },
            { value: 1048576, fd: 0, md: 0, exp: '1 MB' },
            { value: 1000000000, fd: 0, md: 0, exp: '954 MB' },
            { value: 1073741824, fd: 0, md: 0, exp: '1 GB' },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.filesize(test.value, test.fd, test.md).replace(String.fromCharCode(160), ' ')).toBe(test.exp);
        });
    });

});