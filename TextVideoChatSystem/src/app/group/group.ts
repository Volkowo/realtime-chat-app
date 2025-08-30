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
  styleUrl: './group.css'
})
export class Group implements OnInit {
  constructor(private router: Router, private http: HttpClient) {

  }
  user: any;
  userJSON: any;
  groupsJSON: any;
  channelsJSON: any;

  ngOnInit(){
    this.user = (localStorage.getItem("user"))
    if (this.user){
        this.userJSON = JSON.parse(this.user);
        this.http.get(`http://localhost:3000/api/groups/${this.userJSON.id}`).subscribe((groups: any) => {
          this.groupsJSON = groups
          const groupsString = JSON.stringify(groups)
          localStorage.setItem("groups", groupsString);
          console.log("GROUP: " + groupsString);
        })
    } else {
      console.log("User not logged in!")
    }
  }

  selectGroup(groupID: string){
    console.log(groupID)

    this.http.get(`http://localhost:3000/api/groups/${groupID}/channels`).subscribe((channels: any) => {
      this.channelsJSON = channels;
      const channelString = JSON.stringify(channels)
      console.log("channels: ", channelString)
    })
  }



  logOut(){
    localStorage.clear();
    alert("Logged out!")
  }
}
