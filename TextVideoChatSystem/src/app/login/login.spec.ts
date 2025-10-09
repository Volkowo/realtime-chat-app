import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule, HttpClientTestingModule, RouterModule.forRoot([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty username and password initially', () => { 
    expect(component.username).toBe('');
    expect(component.pass).toBe('');
  });

  it('should redirect if user is already logged in', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({id: 1}));
    const routerSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit();
    expect(routerSpy).toHaveBeenCalledWith(['/profile']);
  });

  it('should reset username and password', () => {
    component.username = 'test';
    component.pass = '123';
    component.resetInput();
    expect(component.username).toBe('');
    expect(component.pass).toBe('');
  });

  it('should log in successfully', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    const routerSpy = spyOn(component['router'], 'navigate');

    component.username = 'user';
    component.pass = 'pass';

    component.checkLogin();

    // Match the POST request reliably
    const req = httpMock.expectOne(
      (request) => request.method === 'POST' && request.urlWithParams === 'http://localhost:3000/api/auth'
    );
    
    req.flush({ signedIn: true, id: 1, username: 'user' });

    tick();

    expect(localStorage.getItem('user')).toBe(JSON.stringify({ signedIn: true, id: 1, username: 'user' }));
    expect(routerSpy).toHaveBeenCalledWith(['/group']);
  }));

  it('should alert on invalid credentials', fakeAsync(() => {
    const httpMock = TestBed.inject(HttpTestingController);
    spyOn(window, 'alert');

    component.username = 'wrong';
    component.pass = 'wrong';
    component.checkLogin();

    const req = httpMock.expectOne('http://localhost:3000/api/auth');
    req.flush({ signedIn: false });

    tick();

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials!');
  }));
});
