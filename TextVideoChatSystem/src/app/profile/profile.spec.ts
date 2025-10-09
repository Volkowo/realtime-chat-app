import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { Profile } from './profile';

describe('Profile', () => {
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  // mocking localStorage -> https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user') {
        return JSON.stringify({
          id: '1',
          email: 'og@email.com',
          username: 'super',
          avatar: 'images/pfp/brownie.png',
          roles: ['chatUser', 'superAdmin'],
          signedIn: false
        });
      }
      return null;
    });

    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'removeItem').and.callFake(() => {});

    await TestBed.configureTestingModule({
      imports: [Profile, HttpClientTestingModule, FormsModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    const mockUsers = [{ id: '1', username: 'testUser', roles: ['chatUser'] }];

    const req = httpMock.expectOne('http://localhost:3000/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(component.usersJSON).toEqual(mockUsers);
  });

  it('should correctly identify superAdmin', () => {
    expect(component.isUserSuperAdmin()).toBeTrue();
  });

  it('should correctly identify groupAdmin', () => {
    expect(component.isUserGroupAdmin()).toBeFalse();
  });

  it('should correctly identify chatUser', () => {
    expect(component.isUserChatUser()).toBeTrue();
  });

  it('should set current view', () => {
    component.setCurrentView('testView');
    expect(component.currentView).toBe('testView');
  });

  it('should return correct avatar URL', () => {
    expect(component.getAvatarURL({avatar: 'images/pfp/brownie.png'})).toBe('http://localhost:3000/images/pfp/brownie.png');
  });

  it('should return current user membership', () => {
    component.membershipJSON = [
      { userID: '1', groupID: 'g1', role: 'superAdmin' },
      { userID: '2', groupID: 'g1', role: 'chatUser' }
    ];
    const memberships = component.getCurrentUserMembership('1');
    expect(memberships.length).toBe(1);
    expect(memberships[0].role).toBe('superAdmin');
  });

});
