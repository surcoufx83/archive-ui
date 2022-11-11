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

  it('should apply additional classes correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.addCssClasses = 'bar';
    fixture.detectChanges();
    expect(i).toHaveClass('bar');
  });

  it('should apply font size correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fontSize = 0;
    fixture.detectChanges();
    expect(i.className).toBe('foo');
    for (let j = 1; j < 8; j++) {
      component.fontSize = j;
      fixture.detectChanges();
      expect(i).toHaveClass('fs-' + j);
    }
    component.fontSize = 9;
    fixture.detectChanges();
    expect(i.className).toBe('foo');
  });

  it('should apply fixedWidth correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fixedWidth = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-fw');
  });

  it('should apply marginEnd correct', () => {
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

  it('should apply beat animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.beat = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-beat');
    component.fade = true;
    fixture.detectChanges();
    expect(i).not.toHaveClass('fa-beat');
  });

  it('should apply fade animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fade = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-fade');
    component.beat = true;
    fixture.detectChanges();
    expect(i).not.toHaveClass('fa-fade');
  });

  it('should apply beat-fade animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.fade = true;
    component.beat = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-beat-fade');
  });

  it('should apply bounce animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.bounce = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-bounce');
  });

  it('should apply flip animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.flip = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-flip');
  });

  it('should apply shake animation correct', () => {
    let i: HTMLElement = fixture.nativeElement.querySelector('i');
    component.iconClass = 'foo';
    component.shake = true;
    fixture.detectChanges();
    expect(i).toHaveClass('fa-shake');
  });

  it('should apply spin animation correct', () => {
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

  it('should apply pulse animation correct', () => {
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
