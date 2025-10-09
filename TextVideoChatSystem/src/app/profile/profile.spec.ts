import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { Profile } from './profile';

describe('Profile', () => {
  let httpMock: HttpTestingController;
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  const mockUser = {
    id: '1',
    email: 'og@email.com',
    username: 'super',
    avatar: 'images/pfp/brownie.png',
    roles: ['chatUser', 'superAdmin'],
    signedIn: false
  };

  const mockUsers = [
    { id: '1', username: 'Alice', roles: ['chatUser'] },
    { id: '2', username: 'Bob', roles: ['groupAdmin'] },
    { id: '3', username: 'Mocka', roles: ['chatUser'] }
  ];

  const mockGroups = [
    { groupID: 'g1', groupName: 'Test Group', bannedUsers: [] },
    { groupID: 'g2', groupName: 'Mock Group', bannedUsers: [] }
  ];

  const mockMembership = [
    { userID: '1', groupID: 'g1', role: 'chatUser' },
    { userID: '3', groupID: 'g2', role: 'chatUser' },
    { userID: '2', groupID: 'g1', role: 'groupAdmin' }
  ];

  const mockChannels = [
    { channelID: 'c1', groupID: 'g1', channelName: 'General' }
  ];

  // mocking localStorage -> https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests

  beforeEach(async () => {
    // Mock localStorage before ngOnInit and stuff
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'user' ? JSON.stringify(mockUser) : null;
    });
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'removeItem').and.callFake(() => {});

    await TestBed.configureTestingModule({
      imports: [Profile, HttpClientTestingModule, FormsModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Flush HTTP requests that ngOnInit triggers
    fixture.detectChanges(); // trigger ngOnInit

    // ngOnInit makes multiple GET requests, so we flush them all
    // Fulsh is a way to mock back-end's response; we're mocking ngOnInit's get requests here
    httpMock.expectOne('http://localhost:3000/api/users').flush(mockUsers);
    httpMock.expectOne('http://localhost:3000/api/groups').flush(mockGroups);
    httpMock.expectOne('http://localhost:3000/api/requests').flush([]);
    httpMock.expectOne('http://localhost:3000/api/channels').flush(mockChannels);
    httpMock.expectOne('http://localhost:3000/api/membership').flush(mockMembership);
    httpMock.expectOne(`http://localhost:3000/api/groupsNotIn/${mockUser.id}`).flush([]);
    httpMock.expectOne(`http://localhost:3000/api/groupsIn/${mockUser.id}`).flush([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    expect(component.usersJSON).toEqual(mockUsers);
  });

  it('should return username by ID', () => {
    expect(component.getUsernameById('1')).toBe('Alice');
    expect(component.getUsernameById('3')).toBe('Mocka');
    expect(component.getUsernameById('4')).toBe('Unknown');
  });

  it('should get user roles correctly', () => {
    expect(component.getUserRoles('g1', '1')).toBe('chatUser');
    expect(component.getUserRoles('g1', '3')).toBe('unknown'); // default to unknown since Mocka isnt a member of g1
  });

  it('should return users in group', () => {
    const usersInGroup = component.getUserInGroup('g1');
    expect(usersInGroup.length).toBe(2);
  });

  it('should return users not in group', () => {
    const usersNotInGroup = component.getUserNotInGroup('g1');
    expect(usersNotInGroup.length).toBe(1); // user 3: Mocka isnt in g1 so it should return an array with 1 uhh list inside?
  });

  it('should return channels by group ID', () => {
    const channels = component.getChannelById('g1');
    expect(channels.length).toBe(1);
  });

  it('should check if user is super or group admin', () => {
    expect(component.isSuperOrGroupAdmin('superAdmin')).toBeTrue();
    expect(component.isSuperOrGroupAdmin('groupAdmin')).toBeTrue();
    expect(component.isSuperOrGroupAdmin('chatUser')).toBeFalse();
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
