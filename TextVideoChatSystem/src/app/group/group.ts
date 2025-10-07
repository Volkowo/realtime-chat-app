import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserModel, LoggedInUser } from '../models/users';
import { GroupModel } from '../models/groups';
import { ChannelModel } from '../models/channels';
import { MessageModel } from '../models/messages';
import { Socket } from '../services/socket';

@Component({
  selector: 'app-group',
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule],
  templateUrl: './group.html',
  styleUrls: ['./group.css', './groupBootstrap.css']
})
export class Group implements OnInit {
  constructor(private router: Router, private http: HttpClient, public socketService: Socket) {

  }

  messages: any;
  messageContent: string = "";
  currentGroupID: string = "";
  currentChannelID: string = "";
  user: any;
  userJSON: any;
  usersJSON: any;
  groupsJSON: GroupModel[] = [];
  channelsJSON: ChannelModel[] = [];
  messagesJSON: MessageModel[] = [];

  // Getting user + groups
  ngOnInit(){
    this.socketService.initSocket();
    this.user = (localStorage.getItem("user")); // checks if the user is actually logged in or not. (Logged in user is stored in Local Storage)

    if (this.user){
        this.userJSON = JSON.parse(this.user);
        this.http.get<GroupModel[]>(`http://localhost:3000/api/groups/${this.userJSON.id}`).subscribe((groups: GroupModel[]) => {
          this.groupsJSON = groups
          const groupsString = JSON.stringify(groups)
          console.log("GROUP: " + groupsString);
        })

      this.http.get<UserModel>(`http://localhost:3000/api/users`).subscribe((users) => {
        this.usersJSON = users;
        // console.log(this.usersJSON); 
      })
    } else {
      this.router.navigate([''])
    }
  }

  // Select a group and display the channel inside said group.
  selectGroup(groupID: string){
    console.log("group.ts - selectGroup(): ", groupID);
    this.http.get<ChannelModel[]>(`http://localhost:3000/api/groups/${groupID}/channels`).subscribe((channels: ChannelModel[]) => {
      this.channelsJSON = channels;

      // set the ID for currentGroup
      if(this.currentGroupID !== groupID){
        this.setCurrentGroup(groupID);
        this.setCurrentChannel("")
        this.socketService.leaveChannel(this.currentChannelID, this.userJSON.id);
      } else {

      }

      const channelString = JSON.stringify(channels)
      console.log("channels: ", channelString)
    })
  }
  
  /*
    TODO:
      0. Make models for channels, groups, and messages
      1. Validation -> Check if channelID actually belongs in the Group
      2. Error message for validation
  */

  getMessage(groupID: string, channelID: string){
    this.http.get<MessageModel[]>(`http://localhost:3000/api/groups/${groupID}/channels/${channelID}`).subscribe((messages: any) => {
      this.setCurrentChannel(channelID);

      this.socketService.joinChannel(channelID, this.userJSON.id);
      this.socketService.messages.set(messages);

      console.log("GET MESSAGE: ", this.socketService.messages())
      
      this.messagesJSON = messages;
      const messageString = JSON.stringify(messages);
      console.log("messages: ", messageString)
    })
  }

  getUsernameById(memberID: string){
    if(this.usersJSON){
      const user = this.usersJSON.find((user: any) => user.id === memberID)
      // console.log("USER?! :", user.username)
      return user ? user.username : "Unknown";
    }
  }

  getAvatarById(memberID: string){
    if(this.usersJSON){
      const user = this.usersJSON.find((user: any) => user.id === memberID)
      return user ? `http://localhost:3000/${user.avatar}` : "Unknown";
    } else {
      return "Unknown";
    }
  }
  
  // set current group (and channel)
  setCurrentGroup(groupID: string){
    this.currentGroupID = groupID;
  }

  setCurrentChannel(channelID: string){
    this.currentChannelID = channelID;
  }

  // send message
  sendChat(userID: string, channelID: string, groupID: string){
    console.log(this.messageContent);

    this.socketService.joinChannel(channelID, this.userJSON.id);


    this.http.post(`http://localhost:3000/api/addMessage/${userID}/${channelID}/${groupID}`, {messageContent: this.messageContent}).subscribe((res: any) => {
      // this.messagesJSON = res.updatedMessages;

      // console.log("SEND CHAT: ", this.socketService.messages())
      // this.socketService.send(res.currentMessage, channelID);
    })

    this.messageContent = "";
  }

  
  reset(){
    localStorage.clear();
    alert("All data has been reset.");
    this.router.navigate([''])
  }

  leaveGroup(groupID: string, userID: string){
    console.log(groupID)
    this.http.delete(`http://localhost:3000/api/group/${groupID}/${userID}/leave`, {}).subscribe((res: any) => {
      this.groupsJSON = res

      localStorage.setItem("user", JSON.stringify(this.userJSON));
    })
  }


}
