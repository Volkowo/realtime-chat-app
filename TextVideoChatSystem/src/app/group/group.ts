import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  groupsJSON: any;
  channelsJSON: any;
  messagesJSON: any;
  groupID: string = "";
  channelID: string = "";

  ngOnInit(){
    this.user = (localStorage.getItem("user"))
    if (this.user){
        this.userJSON = JSON.parse(this.user);
        this.http.get(`http://localhost:3000/api/groups/${this.userJSON.id}`).subscribe((groups: any) => {
          this.groupsJSON = groups
          const groupsString = JSON.stringify(groups)
          localStorage.setItem("groups", groupsString);
          console.log("GROUP: " + groupsString);

          this.groupID = localStorage.getItem("selectedGroup") || "";
          this.channelID = localStorage.getItem("selectedChannel") || "";
        })
    } else {
      console.log("User not logged in!")
    }
  }

  selectGroup(groupID: string){
    localStorage.setItem("selectedGroup", groupID);
    this.groupID = localStorage.getItem("selectedGroup") || "";
    console.log("Selected Group: ", this.groupID)

    this.http.get(`http://localhost:3000/api/groups/${groupID}/channels`).subscribe((channels: any) => {
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

  test(channelID: string){
    localStorage.setItem("selectedChannel", channelID);
    this.channelID = localStorage.getItem("selectedChannel") || "";
    console.log("Selected Channel: ", this.channelID)

    this.http.get(`http://localhost:3000/api/groups/${this.groupID}/channels/${this.channelID}`).subscribe((messages: any) => {
      this.messagesJSON = messages;
      const messageString = JSON.stringify(messages);
      console.log("messages: ", messageString)
    })
  }



  logOut(){
    localStorage.clear();
    alert("Logged out!")
  }
}
