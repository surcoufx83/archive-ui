import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from "@angular/common";

import { ButtonComponent } from './button.component';

class DummyComponent { }

const routes: Routes = [
  { path: '', redirectTo: 'foo', pathMatch: 'full' },
  { path: 'foo', component: DummyComponent }
];

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [ButtonComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display as li-element with correct button, icon and title', () => {
    fixture.detectChanges();
    let li: HTMLElement = fixture.nativeElement.querySelector('li');
    let a: HTMLElement = fixture.nativeElement.querySelector('a');
    expect(li).toBeTruthy();
    expect(a).toBeFalsy();
    expect(li).toHaveClass('breadcrumb-item');
    let button = li.querySelector('button');
    expect(button).toBeTruthy();
    expect(button).toHaveClass('me-1');
    let icon = button!.querySelector('i');
    expect(icon).toBeTruthy();
    expect(icon!.classList.value).toBe('');
    expect(button!.textContent?.trim()).toBe('');
  });

  it('should display as a-element with correct button, icon and title', () => {
    component.link = '/foo';
    fixture.detectChanges();
    let li: HTMLElement = fixture.nativeElement.querySelector('li');
    let a: HTMLElement = fixture.nativeElement.querySelector('a');
    expect(li).toBeFalsy();
    expect(a).toBeTruthy();
    expect(a).toHaveClass('breadcrumb-item');
    let button = a.querySelector('button');
    expect(button).toBeTruthy();
    expect(button!.classList.value).toBe('me-1');
    let icon = button!.querySelector('i');
    expect(icon).toBeTruthy();
    expect(icon!.classList.value).toBe('');
    expect(button!.textContent?.trim()).toBe('');
  });

  it('should set correct css class in li-button', () => {
    component.css = 'foo';
    fixture.detectChanges();
    let button: HTMLElement = fixture.nativeElement.querySelector('li > button');
    expect(button.classList.value).toBe('me-1 foo');
  });

  it('should set correct icon class in li-button', () => {
    component.css = 'foo';
    component.icon = 'fa-solid fa-foo';
    fixture.detectChanges();
    let icon: HTMLElement = fixture.nativeElement.querySelector('li > button > i');
    expect(icon.classList.value).toBe('fa-solid fa-foo');
  });

  it('should set correct text content in li-button', () => {
    component.css = 'foo';
    component.title = 'foo bar';
    fixture.detectChanges();
    let button: HTMLElement = fixture.nativeElement.querySelector('li > button');
    expect(button!.textContent?.trim()).toBe('foo bar');
  });

  it('should call click fn on li-button', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'click');
    let button: HTMLElement = fixture.nativeElement.querySelector('li > button');
    button.dispatchEvent(new Event('click'));
    tick();
    expect(component.click).toHaveBeenCalled();
  }));

  it('should emit click event on li-button', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component.clicked, 'emit');
    let button: HTMLElement = fixture.nativeElement.querySelector('li > button');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.clicked.emit).toHaveBeenCalled();
  }));

  it('should set correct css class in a-button', () => {
    component.css = 'foo';
    component.link = '/foo';
    fixture.detectChanges();
    let button: HTMLElement = fixture.nativeElement.querySelector('a > button');
    expect(button.classList.value).toBe('me-1 foo');
  });

  it('should set correct icon class in a-button', () => {
    component.css = 'foo';
    component.icon = 'fa-solid fa-foo';
    component.link = '/foo';
    fixture.detectChanges();
    let icon: HTMLElement = fixture.nativeElement.querySelector('a > button > i');
    expect(icon.classList.value).toBe('fa-solid fa-foo');
  });

  it('should set correct text content in a-button', () => {
    component.css = 'foo';
    component.title = 'foo bar';
    component.link = '/foo';
    fixture.detectChanges();
    let button: HTMLElement = fixture.nativeElement.querySelector('a > button');
    expect(button!.textContent?.trim()).toBe('foo bar');
  });

  it('should NOT emit click event on a-button', fakeAsync(() => {
    component.link = '/foo';
    fixture.detectChanges();
    spyOn(component, 'click');
    let button: HTMLElement = fixture.nativeElement.querySelector('a > button');
    button.click();
    tick();
    expect(component.click).toHaveBeenCalledTimes(0);
  }));

  it('should navigate to the correct route when clicking on a-button',
    fakeAsync((inject([Router, Location], (router: Router, location: Location) => {
      component.link = '/foo';
      fixture.detectChanges();
      let button: HTMLElement = fixture.nativeElement.querySelector('a > button');
      button.click();
      tick();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/foo');
      });
    })))
  );

});
