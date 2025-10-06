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

@Component({
  selector: 'app-group',
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule],
  templateUrl: './group.html',
  styleUrls: ['./group.css', './groupBootstrap.css']
})
export class Group implements OnInit {
  constructor(private router: Router, private http: HttpClient) {

  }
  user: any;
  userJSON: any;
  groupsJSON: GroupModel[] = [];
  channelsJSON: ChannelModel[] = [];
  messagesJSON: MessageModel[] = [];

  // Getting user + groups
  ngOnInit(){
    this.user = (localStorage.getItem("user")); // checks if the user is actually logged in or not. (Logged in user is stored in Local Storage)

    if (this.user){
        this.userJSON = JSON.parse(this.user);
        this.http.get<GroupModel[]>(`http://localhost:3000/api/groups/${this.userJSON.id}`).subscribe((groups: GroupModel[]) => {
          this.groupsJSON = groups
          const groupsString = JSON.stringify(groups)
          console.log("GROUP: " + groupsString);
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
    this.http.get<MessageModel[]>(`http://localhost:3000/api/groups/${groupID}/channels/${channelID}`).subscribe((messages: MessageModel[]) => {
      this.messagesJSON = messages;
      const messageString = JSON.stringify(messages);
      console.log("messages: ", messageString)
    })
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
