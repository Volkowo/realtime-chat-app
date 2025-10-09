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

  it('should add user to group', () => {
    component.addUserToGroup('g1', '3');

    const req = httpMock.expectOne('http://localhost:3000/api/group/g1/add/3');
    expect(req.request.method).toBe('PUT');
    req.flush({
      updatedMembership: [...component.membershipJSON, { userID: '3', groupID: 'g1', role: 'chatUser' }],
      updatedRequests: []
    });

    expect(component.membershipJSON.length).toBe(4);
  });

  it('should create new group', () => {
    component.createNewGroup('New Group', 'New Channel', '1');

    const req = httpMock.expectOne('http://localhost:3000/api/group/newGroup/1/New Group/New Channel');
    expect(req.request.method).toBe('POST');
    req.flush({
      updatedGroup: [...component.groupsJSON, { groupID: 'g2', groupName: 'New Group', bannedUsers: [] }],
      updatedMembership: component.membershipJSON,
      updatedUsers: component.usersJSON,
      updatedChannel: component.channelJSON
    });

    expect(component.groupsJSON.length).toBe(3);
  });

  it('should promote user to superAdmin', () => {
    component.promoteToSuperAdmin('1');

    const req = httpMock.expectOne('http://localhost:3000/api/user/1/superAdminPromotion');
    expect(req.request.method).toBe('PUT');

    // Mock backend response as well goodness gracious
    const updatedUsers = [
      { id: '1', username: 'Alice', roles: ['chatUser', 'superAdmin'] },
      { id: '2', username: 'Bob', roles: ['groupAdmin'] },
      { id: '3', username: 'Mocka', roles: ['chatUser'] }
    ];

    // mock the actual response
    req.flush({
      updatedUser: updatedUsers,
      updatedMembership: component.membershipJSON
    });

    expect(Array.isArray(component.usersJSON)).toBeTrue();

    const promotedUser = component.usersJSON.find((u: any) => u.id === '1');
    expect(promotedUser!.roles).toContain('superAdmin');
  });

  it('should delete a group', () => {
    component.deleteGroup('g1');

    const req = httpMock.expectOne('http://localhost:3000/api/group/g1/remove');
    expect(req.request.method).toBe('DELETE');
    req.flush({
      updatedGroup: [],
      updatedMembership: [],
      updatedChannel: []
    });

    expect(component.groupsJSON.length).toBe(0);
  });

  // manageUser (kick/ban)
  it('should kick a user', () => {
    component.selectedUser = '1';
    component.manageUser('1', 'g1', '', 'kick');

    const req = httpMock.expectOne('http://localhost:3000/api/group/g1/user/1/kick');
    expect(req.request.method).toBe('DELETE');
    req.flush(component.membershipJSON.filter((m: any) => m.userID !== '1'));

    expect(component.membershipJSON.find((m: any) => m.userID === '1')).toBeUndefined();
  });

});
