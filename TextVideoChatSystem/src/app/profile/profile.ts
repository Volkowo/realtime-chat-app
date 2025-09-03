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
  users: any;
  usersJSON: any;

  ngOnInit() {
      this.user = (localStorage.getItem("user"))
      if (this.user){
          this.userJSON = JSON.parse(this.user);
          console.log("USER: ", this.user)
          
          this.users = (localStorage.getItem("users"))
          console.log("Users: ", this.users)
          this.usersJSON = JSON.parse(this.users)
          console.log(this.usersJSON); 
      } else {
        this.router.navigate([''])
      }
  }
  
  logOut(){
    localStorage.removeItem("user");
    alert("Logged out!");
    this.router.navigate([''])
  }

  hasAdmin(user: any){
    return user.groups.filter((group: any) => group.role == 'groupAdmin' || group.role == 'superAdmin')
  }

  isSuperAdmin(user: any): boolean {
    return user.roles.includes('superAdmin');
  }

  getGroupById(groupID: string){
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const group = groups.find((group: any) => group.groupID === groupID)
    return group ? group.groupName : 'Unknown';
  }

  checkGroupAdminRole(user: any){
    // console.log("User groups:", user.groups);
    const nonAdmin = user.groups.filter((group: any) => group.role == "member");
    // console.log(nonAdmin);
    return nonAdmin;
  }

  checkUser(user: any, group: any){
    console.log("Button check", user);
    console.log("what is group: ", group)
  }
}
