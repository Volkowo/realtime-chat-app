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
  selector: 'app-profile',
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  constructor(private router: Router, private http: HttpClient) {
  }

  user: any;
  userJSON: any;

  ngOnInit() {
      this.user = (localStorage.getItem("user"))
      if (this.user){
          this.userJSON = JSON.parse(this.user);
          console.log("USER: ", this.user)
      } else {
        this.router.navigate([''])
      }
  }
  
  logOut(){
    localStorage.removeItem("user");
    alert("Logged out!");
    this.router.navigate([''])
  }
}
