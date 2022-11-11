import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct icon', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    fixture.detectChanges();
    expect(i).toBeTruthy();
    expect(i.className).toBe('foo');
  });

  it('should show apply additional classes correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.addCssClasses = 'bar';
    fixture.detectChanges();
    expect(i).toHaveClass('bar');
  });

  it('should show apply fixedWidth correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fixedWidth = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-fw');
  });

  it('should show apply marginEnd correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.marginEnd = 0;
    fixture.detectChanges();
    expect(i.className).toBe('foo');
    for (let j = 1; j < 6; j++) {
      component.marginEnd = j;
      fixture.detectChanges();
      expect(i).toHaveClass('me-' + j);
    }
    component.marginEnd = 6;
    fixture.detectChanges();
    expect(i.className).toBe('foo');
  });

  it('should show apply beat animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.beat = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-beat');
    component.fade = true;
    fixture.detectChanges();
    expect(i).not.toHaveClass('fa-beat');
  });

  it('should show apply fade animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fade = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-fade');
    component.beat = true;
    fixture.detectChanges();
    expect(i).not.toHaveClass('fa-fade');
  });

  it('should show apply beat-fade animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fade = true;
    component.beat = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-beat-fade');
  });

  it('should show apply bounce animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.bounce = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-bounce');
  });

  it('should show apply flip animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.flip = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-flip');
  });

  it('should show apply shake animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.shake = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-shake');
  });

  it('should show apply spin animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.spin = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-spin');
    component.pulse = true;
    fixture.detectChanges();
    expect(i).not.toHaveClass('fa-spin');
    component.pulse = false;
    component.reverse = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-spin-reverse');
  });

  it('should show apply pulse animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.pulse = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-spin-pulse');
    component.spin = true;
    fixture.detectChanges();
    expect(i).not.toHaveClass('fa-spin-pulse');
  });

});
