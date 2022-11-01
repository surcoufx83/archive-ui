import { format, formatDistanceToNow } from "date-fns";
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
        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').withArgs('common.novalue').and.returnValue('foo');
        i18nServiceMockDeDe.i18n = jasmine.createSpy('i18n').withArgs('common.novalue').and.returnValue('bar');
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
            { value: 0, fd: 0, md: 0, expEn: '0', expDe: '0' },
            { value: 1, fd: 0, md: 0, expEn: '1', expDe: '1' },
            { value: 1, fd: 1, md: 1, expEn: '1.0', expDe: '1,0' },
            { value: 1, fd: 2, md: 2, expEn: '1.00', expDe: '1,00' },
            { value: 1, fd: 0, md: 1, expEn: '1', expDe: '1' },
            { value: 1, fd: 0, md: 2, expEn: '1', expDe: '1' },
            { value: -1, fd: 0, md: 0, expEn: '-1', expDe: '-1' },
            { value: -1, fd: 1, md: 1, expEn: '-1.0', expDe: '-1,0' },
            { value: -1, fd: 2, md: 2, expEn: '-1.00', expDe: '-1,00' },
            { value: -1, fd: 0, md: 1, expEn: '-1', expDe: '-1' },
            { value: -1, fd: 0, md: 2, expEn: '-1', expDe: '-1' },
            { value: .99, fd: 0, md: 0, expEn: '1', expDe: '1' },
            { value: .99, fd: 1, md: 1, expEn: '1.0', expDe: '1,0' },
            { value: .99, fd: 2, md: 2, expEn: '0.99', expDe: '0,99' },
            { value: .99, fd: 0, md: 1, expEn: '1', expDe: '1' },
            { value: .99, fd: 0, md: 2, expEn: '0.99', expDe: '0,99' },
            { value: .99, fd: 0, md: 3, expEn: '0.99', expDe: '0,99' },
            { value: .99, fd: 3, md: 3, expEn: '0.990', expDe: '0,990' },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.fnumber(test.value, test.fd, test.md).replace(String.fromCharCode(160), ' ')).toBe(test.expEn);
            expect(formatServiceDeDe.fnumber(test.value, test.fd, test.md).replace(String.fromCharCode(160), ' ')).toBe(test.expDe);
        });
    });

    it('should return the correct filesize string', () => {
        let tests = [
            { value: 0, fd: 0, md: 0, expEn: '0 B', expDe: '0 B' },
            { value: 1, fd: 0, md: 0, expEn: '1 B', expDe: '1 B' },
            { value: 1000, fd: 0, md: 0, expEn: '1,000 B', expDe: '1.000 B' },
            { value: 1024, fd: 0, md: 0, expEn: '1 KB', expDe: '1 KB' },
            { value: 1100, fd: 0, md: 1, expEn: '1.1 KB', expDe: '1,1 KB' },
            { value: 1100, fd: 0, md: 2, expEn: '1.07 KB', expDe: '1,07 KB' },
            { value: 1100, fd: 0, md: 3, expEn: '1.074 KB', expDe: '1,074 KB' },
            { value: 1024, fd: 0, md: undefined, expEn: '1 KB', expDe: '1 KB' },
            { value: 1100, fd: 0, md: undefined, expEn: '1.074 KB', expDe: '1,074 KB' },
            { value: 1100, fd: 0, md: undefined, expEn: '1.074 KB', expDe: '1,074 KB' },
            { value: 1100, fd: 0, md: undefined, expEn: '1.074 KB', expDe: '1,074 KB' },
            { value: 1024, fd: 1, md: 1, expEn: '1.0 KB', expDe: '1,0 KB' },
            { value: 1024, fd: 2, md: 2, expEn: '1.00 KB', expDe: '1,00 KB' },
            { value: 1024, fd: 2, md: 4, expEn: '1.00 KB', expDe: '1,00 KB' },
            { value: 2000, fd: 0, md: 0, expEn: '2 KB', expDe: '2 KB' },
            { value: 10000, fd: 0, md: 0, expEn: '10 KB', expDe: '10 KB' },
            { value: 1000000, fd: 0, md: 0, expEn: '977 KB', expDe: '977 KB' },
            { value: 1048576, fd: 0, md: 0, expEn: '1 MB', expDe: '1 MB' },
            { value: 1000000000, fd: 0, md: 0, expEn: '954 MB', expDe: '954 MB' },
            { value: 1073741824, fd: 0, md: 0, expEn: '1 GB', expDe: '1 GB' },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.filesize(test.value, test.fd, test.md).replace(String.fromCharCode(160), ' ')).toBe(test.expEn);
            expect(formatServiceDeDe.filesize(test.value, test.fd, test.md).replace(String.fromCharCode(160), ' ')).toBe(test.expDe);
        });
    });

    it('should return the correct percent string', () => {
        let tests = [
            { value: 0, fd: 0, expEn: '0%', expDe: '0%' },
            { value: 1, fd: 0, expEn: '1%', expDe: '1%' },
            { value: 1, fd: 1, expEn: '1.0%', expDe: '1,0%' },
            { value: 1, fd: 2, expEn: '1.00%', expDe: '1,00%' },
            { value: -1, fd: 0, expEn: '-1%', expDe: '-1%' },
            { value: -1, fd: 1, expEn: '-1.0%', expDe: '-1,0%' },
            { value: -1, fd: 2, expEn: '-1.00%', expDe: '-1,00%' },
            { value: .99, fd: 0, expEn: '0.99%', expDe: '0,99%' },
            { value: .99, fd: 1, expEn: '0.99%', expDe: '0,99%' },
            { value: .99, fd: 2, expEn: '0.99%', expDe: '0,99%' },
            { value: .99, fd: 3, expEn: '0.990%', expDe: '0,990%' },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.fpercent(test.value, test.fd).replace(String.fromCharCode(160), ' ')).toBe(test.expEn);
            expect(formatServiceDeDe.fpercent(test.value, test.fd).replace(String.fromCharCode(160), ' ')).toBe(test.expDe);
        });
    });

    it('should return the correct date string', () => {
        let tests = [
            { value: null, form: 'd.M.y', expEn: 'foo', expDe: 'bar' },
            { value: '2022-01-01', form: 'd.M.y', expEn: format(new Date('2022-01-01'), 'd.M.y', { locale: enUS }), expDe: format(new Date('2022-01-01'), 'd.M.y', { locale: de }) },
            { value: '2022-01-01', form: 'y-M-d', expEn: format(new Date('2022-01-01'), 'y-M-d', { locale: enUS }), expDe: format(new Date('2022-01-01'), 'y-M-d', { locale: de }) },
            { value: new Date('2022-01-01'), form: 'd.M.y', expEn: format(new Date('2022-01-01'), 'd.M.y', { locale: enUS }), expDe: format(new Date('2022-01-01'), 'd.M.y', { locale: de }) },
            { value: new Date('2022-01-01'), form: 'd.M.y', expEn: format(new Date('2022-01-01'), 'd.M.y', { locale: enUS }), expDe: format(new Date('2022-01-01'), 'd.M.y', { locale: de }) },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.fdate(test.value, test.form).replace(String.fromCharCode(160), ' ')).toBe(test.expEn);
            expect(formatServiceDeDe.fdate(test.value, test.form).replace(String.fromCharCode(160), ' ')).toBe(test.expDe);
            if (test.value == null) {
                expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(1);
                expect(i18nServiceMockDeDe.i18n).toHaveBeenCalledTimes(1);
            }
        });
    });

    it('should return the correct date dist string', () => {
        let tests = [
            { value: null, expEn: 'foo', expDe: 'bar' },
            { value: '2022-01-01', expEn: formatDistanceToNow(new Date('2022-01-01'), { locale: enUS }), expDe: formatDistanceToNow(new Date('2022-01-01'), { locale: de }) },
            { value: '2022-01-01', expEn: formatDistanceToNow(new Date('2022-01-01'), { locale: enUS }), expDe: formatDistanceToNow(new Date('2022-01-01'), { locale: de }) },
            { value: new Date('2022-01-01'), expEn: formatDistanceToNow(new Date('2022-01-01'), { locale: enUS }), expDe: formatDistanceToNow(new Date('2022-01-01'), { locale: de }) },
            { value: new Date('2022-01-01'), expEn: formatDistanceToNow(new Date('2022-01-01'), { locale: enUS }), expDe: formatDistanceToNow(new Date('2022-01-01'), { locale: de }) },
        ];
        tests.forEach((test) => {
            expect(formatServiceEnUs.fdist(test.value).replace(String.fromCharCode(160), ' ')).toBe(test.expEn);
            expect(formatServiceDeDe.fdist(test.value).replace(String.fromCharCode(160), ' ')).toBe(test.expDe);
            if (test.value == null) {
                expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(1);
                expect(i18nServiceMockDeDe.i18n).toHaveBeenCalledTimes(1);
            }
        });
    });

    it('should return the correct duration string', () => {
        let tests = [
            { value: null, i18n: [], ret: '', exp: '' },
            { value: <Duration>{}, i18n: [], ret: '', exp: '' },
            { value: <Duration>{ seconds: 0 }, i18n: [], ret: '', exp: '' },
            { value: <Duration>{ seconds: 1 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['0', '0', '1'] }], ret: '0h 0m 1s', exp: '0h 0m 1s' },
            { value: <Duration>{ minutes: 1, seconds: 1 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['0', '1', '1'] }], ret: '0h 1m 1s', exp: '0h 1m 1s' },
            { value: <Duration>{ minutes: 1, seconds: 0 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['0', '1', '0'] }], ret: '0h 1m 0s', exp: '0h 1m 0s' },
            { value: <Duration>{ hours: 1, minutes: 1, seconds: 1 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['1', '1', '1'] }], ret: '1h 1m 1s', exp: '1h 1m 1s' },
            { value: <Duration>{ hours: 1, minutes: 1, seconds: 0 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['1', '1', '0'] }], ret: '1h 1m 0s', exp: '1h 1m 0s' },
            { value: <Duration>{ hours: 1, minutes: 0, seconds: 0 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['1', '0', '0'] }], ret: '1h 0m 0s', exp: '1h 0m 0s' },
            { value: <Duration>{ hours: 1, minutes: 0, seconds: 1 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['1', '0', '1'] }], ret: '1h 0m 1s', exp: '1h 0m 1s' },
            { value: <Duration>{ hours: 0, minutes: 0, seconds: 60 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['0', '1', '0'] }], ret: '0h 1m 0s', exp: '0h 1m 0s' },
            { value: <Duration>{ hours: 0, minutes: 60, seconds: 60 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['1', '1', '0'] }], ret: '1h 1m 0s', exp: '1h 1m 0s' },
            { value: <Duration>{ hours: 0, minutes: 60, seconds: 0 }, i18n: [{ pattern: 'common.period.patternTime', ar: ['1', '0', '0'] }], ret: '1h 0m 0s', exp: '1h 0m 0s' },
            { value: <Duration>{ hours: 24, minutes: 0, seconds: 0 }, i18n: [{ pattern: 'common.period.patternDays', ar: ['1'] }], ret: '1d', exp: '1d' },
        ];
        tests.forEach((test) => {
            if (test.i18n.length > 0)
                i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues(test.ret);
            expect(formatServiceEnUs.fdur(test.value).replace(String.fromCharCode(160), ' ')).toBe(test.exp);
            if (test.i18n.length > 0) {
                expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(test.i18n.length);
                test.i18n.forEach((def) => expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith(def.pattern, def.ar));
            }
        });
    });

    it('should return the correct complex duration string', () => {
        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('2d', '12h 0m 0s');
        expect(formatServiceEnUs.fdur({ hours: 60, minutes: 0, seconds: 0 }).replace(String.fromCharCode(160), ' ')).toBe('2d 12h 0m 0s');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(2);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['2']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternTime', ['12', '0', '0']);

        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('1d', '1h 0m 0s');
        expect(formatServiceEnUs.fdur({ days: 1, hours: 1, minutes: 0, seconds: 0 }).replace(String.fromCharCode(160), ' ')).toBe('1d 1h 0m 0s');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(2);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternTime', ['1', '0', '0']);

        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('1m', '2d', '1h 0m 0s');
        expect(formatServiceEnUs.fdur({ days: 33, hours: 1, minutes: 0, seconds: 0 }).replace(String.fromCharCode(160), ' ')).toBe('1m 2d 1h 0m 0s');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(3);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternMonths', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['2']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternTime', ['1', '0', '0']);

        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('1m', '2d');
        expect(formatServiceEnUs.fdur({ days: 33 }).replace(String.fromCharCode(160), ' ')).toBe('1m 2d');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(2);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternMonths', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['2']);

        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('1m', '1d', '1h 0m 0s');
        expect(formatServiceEnUs.fdur({ months: 1, days: 1, hours: 1, minutes: 0, seconds: 0 }).replace(String.fromCharCode(160), ' ')).toBe('1m 1d 1h 0m 0s');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(3);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternMonths', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternTime', ['1', '0', '0']);

        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('1y', '1d', '1h 0m 0s');
        expect(formatServiceEnUs.fdur({ months: 12, days: 1, hours: 1, minutes: 0, seconds: 0 }).replace(String.fromCharCode(160), ' ')).toBe('1y 1d 1h 0m 0s');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(3);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternYears', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternTime', ['1', '0', '0']);

        i18nServiceMockEnUs.i18n = jasmine.createSpy('i18n').and.returnValues('1y', '1m', '1d', '1h 0m 0s');
        expect(formatServiceEnUs.fdur({ years: 1, months: 1, days: 1, hours: 1, minutes: 0, seconds: 0 }).replace(String.fromCharCode(160), ' ')).toBe('1y 1m 1d 1h 0m 0s');
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledTimes(4);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternYears', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternMonths', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternDays', ['1']);
        expect(i18nServiceMockEnUs.i18n).toHaveBeenCalledWith('common.period.patternTime', ['1', '0', '0']);
    });

});