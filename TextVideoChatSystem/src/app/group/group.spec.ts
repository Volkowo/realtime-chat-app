import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Socket } from '../services/socket';
import { Group } from './group';

describe('Group', () => {
  let component: Group;
  let fixture: ComponentFixture<Group>;
  let httpMock: HttpTestingController;
  let mockSocketService: any;

  beforeEach(async () => {
    mockSocketService = {
      initSocket: jasmine.createSpy('initSocket'),
      joinChannel: jasmine.createSpy('joinChannel'),
      leaveChannel: jasmine.createSpy('leaveChannel'),
      messages: new Map(),
      send: jasmine.createSpy('send')
    };

    await TestBed.configureTestingModule({
      imports: [Group, FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: Socket, useValue: mockSocketService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Group);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 'user123', username: 'testuser', roles: [] }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should return username by id', () => {
    component.usersJSON = [{ id: 'user123', username: 'testuser' }];
    expect(component.getUsernameById('user123')).toBe('testuser');
    expect(component.getUsernameById('nonexistent')).toBe('Unknown'); 
  });

  it('should return avatar URL by id', () => {
    component.usersJSON = [{ id: 'user123', avatar: 'avatar.png' }];
    expect(component.getAvatarById('user123')).toBe('http://localhost:3000/avatar.png');
    expect(component.getAvatarById('nonexistent')).toBe('Unknown');
  });

  it('should initialize and fetch groups and users', () => {
    const reqGroups = httpMock.expectOne('http://localhost:3000/api/groups/user123');
    expect(reqGroups.request.method).toBe('GET');
    reqGroups.flush([{ groupID: 'g1', groupName: 'Test Group', serverPic: '' }]);

    const reqUsers = httpMock.expectOne('http://localhost:3000/api/users');
    expect(reqUsers.request.method).toBe('GET');
    reqUsers.flush([{ id: 'user123', username: 'testuser', avatar: 'avatar.png' }]);

    expect(component.groupsJSON.length).toBe(1);
    expect(component.usersJSON.length).toBe(1);
  });

  it('should select a group and fetch channels', () => {
    component.currentGroupID = '';
    component.selectGroup('g1');

    const req = httpMock.expectOne('http://localhost:3000/api/groups/g1/channels');
    expect(req.request.method).toBe('GET');
    req.flush([{ channelID: 'c1', channelName: 'General' }]);

    expect(component.channelsJSON.length).toBe(1);
    expect(component.currentGroupID).toBe('g1');
  });
});
