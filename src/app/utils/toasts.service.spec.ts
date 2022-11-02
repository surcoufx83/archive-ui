import { Toast, ToastsService } from "./toasts.service";

describe('ToastsService', () => {

    let toastsService: ToastsService;

    beforeEach(() => {
        toastsService = new ToastsService();
    });

    it('should create null toast BehaviorSubject', () => {
        expect(toastsService.toast$.value).toBeNull();
    });

    it('should create correct Toast object after confirm()', () => {
        toastsService.confirm('foo', 'bar');
        expect(toastsService.toast$.value !== null).toBeTrue();
        expect(toastsService.toast$.value?.closable).toBeUndefined();
        expect(toastsService.toast$.value?.disposable).toBeUndefined();
        expect(toastsService.toast$.value?.disposeTime).toEqual(2500);
        expect(toastsService.toast$.value?.icon).toEqual('fa-regular fa-circle-check');
        expect(toastsService.toast$.value?.message).toEqual('bar');
        expect(toastsService.toast$.value?.title).toEqual('foo');
        expect(toastsService.toast$.value?.type).toBeUndefined();
        expect(toastsService.toast$.value?.when).toBeInstanceOf(Date);
    });

    it('should create correct Toast object after error()', () => {
        toastsService.error('foo', 'bar');
        expect(toastsService.toast$.value !== null).toBeTrue();
        expect(toastsService.toast$.value?.closable).toBeUndefined();
        expect(toastsService.toast$.value?.disposable).toBeUndefined();
        expect(toastsService.toast$.value?.disposeTime).toEqual(10000);
        expect(toastsService.toast$.value?.icon).toEqual('fa-regular fa-circle-xmark');
        expect(toastsService.toast$.value?.message).toEqual('bar');
        expect(toastsService.toast$.value?.title).toEqual('foo');
        expect(toastsService.toast$.value?.type).toEqual('error');
        expect(toastsService.toast$.value?.when).toBeInstanceOf(Date);
    });

    it('should create correct Toast object after fatal()', () => {
        toastsService.fatal('foo', 'bar');
        expect(toastsService.toast$.value !== null).toBeTrue();
        expect(toastsService.toast$.value?.closable).toBeFalse();
        expect(toastsService.toast$.value?.disposable).toBeFalse();
        expect(toastsService.toast$.value?.disposeTime).toBeUndefined();
        expect(toastsService.toast$.value?.icon).toEqual('fa-solid fa-triangle-exclamation');
        expect(toastsService.toast$.value?.message).toEqual('bar');
        expect(toastsService.toast$.value?.title).toEqual('foo');
        expect(toastsService.toast$.value?.type).toEqual('error');
        expect(toastsService.toast$.value?.when).toBeInstanceOf(Date);
    });

    it('should create correct Toast object after warn()', () => {
        toastsService.warn('foo', 'bar');
        expect(toastsService.toast$.value !== null).toBeTrue();
        expect(toastsService.toast$.value?.closable).toBeUndefined();
        expect(toastsService.toast$.value?.disposable).toBeUndefined();
        expect(toastsService.toast$.value?.disposeTime).toEqual(5000);
        expect(toastsService.toast$.value?.icon).toEqual('fa-regular fa-circle-xmark');
        expect(toastsService.toast$.value?.message).toEqual('bar');
        expect(toastsService.toast$.value?.title).toEqual('foo');
        expect(toastsService.toast$.value?.type).toEqual('warn');
        expect(toastsService.toast$.value?.when).toBeInstanceOf(Date);
    });

});