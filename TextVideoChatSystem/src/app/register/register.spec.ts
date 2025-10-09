import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, FormsModule, HttpClientTestingModule, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty fields initially', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.email).toBe('');
  });

  it('should alert and navigate on successful registration', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    const routerSpy = spyOn(component['router'], 'navigate');
    spyOn(window, 'alert');

    component.username = 'user';
    component.password = 'pass';
    component.email = 'user@example.com';

    component.register(component.username, component.password, component.email);

    const req = httpMock.expectOne('http://localhost:3000/api/register');
    expect(req.request.method).toBe('POST');

    req.flush({ register: true }); 
    tick();

    expect(window.alert).toHaveBeenCalledWith('Registration successful!');
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.email).toBe('');
  }));

  it('should alert on failed registration', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    spyOn(window, 'alert');

    component.username = 'user';
    component.password = 'pass';
    component.email = 'user@example.com';

    component.register(component.username, component.password, component.email);

    const req = httpMock.expectOne('http://localhost:3000/api/register');
    req.flush({ register: false }); 
    tick();

    expect(window.alert).toHaveBeenCalledWith('Username or email already exists. Please try again.');
  }));

  it('should alert if fields are empty', () => {
    spyOn(window, 'alert');

    component.username = '';
    component.password = '';
    component.email = '';

    component.register(component.username, component.password, component.email);

    expect(window.alert).toHaveBeenCalledWith('Input fields cannot be empty.');
  });
});
