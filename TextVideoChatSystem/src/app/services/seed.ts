import { Injectable } from '@angular/core';
import { ChannelModel } from '../models/channels';
import { GroupModel } from '../models/groups';
import { UserModel } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class Seed {
  constructor(){}

  runSeed(){
    if(!localStorage.getItem("groups") || !localStorage.getItem("users")){
      // Hard-coded data
      const group1Channels = [
        new ChannelModel('c1', 'general'),
        new ChannelModel('c2', 'random')
      ];
      group1Channels[0].addMessage('1', 'Welcome to TestGroup!');
      group1Channels[0].addMessage('2', 'Hi everyone!');
      group1Channels[1].addMessage('4', 'Random thoughts here...');

      const group2Channels = [
        new ChannelModel('c3', 'general'),
        new ChannelModel('c4', 'memes')
      ];
      group2Channels[0].addMessage('2', 'Hello FunGroup!');
      group2Channels[0].addMessage('3', 'Hi userTwo!');
      group2Channels[1].addMessage('3', 'Check out this meme!');

      const group3Channels = [
        new ChannelModel('c5', 'projects')
      ];
      group3Channels[0].addMessage('5', 'Working on project phase 1');

      const groups = [
        new GroupModel('1', 'TestGroup', group1Channels, ['1', '2', '4']),
        new GroupModel('2', 'FunGroup', group2Channels, ['2', '3']),
        new GroupModel('3', 'ProjectGroup', group3Channels, ['5'])
      ];

      const users = [
        new UserModel('1', 'og@email.com', 'super', '123', ['chatUser', 'superAdmin'], [
          { group: '1', role: 'superAdmin' },
          { group: '2', role: 'superAdmin' },
          { group: '3', role: 'superAdmin' },
        ]),
        new UserModel('2', 'user2@email.com', 'userTwo', '123', ['chatUser'], [{ group: '1', role: 'member' }, { group: '2', role: 'member' }]),
        new UserModel('3', 'user3@email.com', 'userThree', '123', ['chatUser', 'groupAdmin'], [{ group: '2', role: 'groupAdmin' }]),
        new UserModel('4', 'user4@email.com', 'userFour', '123', ['chatUser'], [{ group: '1', role: 'member' }]),
        new UserModel('5', 'user5@email.com', 'userFive', '123', ['chatUser'], [{ group: '3', role: 'member' }])
      ];

      // Save into localStorage
      localStorage.setItem('groups', JSON.stringify(groups));
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}
