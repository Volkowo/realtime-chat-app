import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PromoteModal } from "../promote-modal/promote-modal";
@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterModule, HttpClientModule, CommonModule, PromoteModal],
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
  groups: any;
  groupsJSON: any;

  ngOnInit() {
      this.user = (localStorage.getItem("user"))
      if (this.user){
          this.userJSON = JSON.parse(this.user);
          console.log("USER: ", this.user)
          
          this.http.get(`http://localhost:3000/api/users`).subscribe((users: any) => {
            this.users = JSON.stringify(users);
            console.log("Users: ", this.users)
            this.usersJSON = users;
            console.log(this.usersJSON); 
          })

          this.http.get(`http://localhost:3000/api/groups`).subscribe((groups: any) => {
            this.groups = JSON.stringify(groups);
            console.log("Groups: ", this.groups)
            this.groupsJSON = groups;
            console.log(this.groupsJSON); 
          })


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
    if(this.groupsJSON){
      const group = this.groupsJSON.find((group: any) => group.groupID === groupID)
      return group ? group.groupName : 'Unknown';
    } else {
      
    }
  }

  checkGroupAdminRole(user: any){
    // console.log("User groups:", user.groups);
    const nonAdmin = user.groups.filter((group: any) => group.role == "chatUser");
    // console.log(nonAdmin);
    return nonAdmin;
  }

  checkUser(user: any, group: any){
    console.log("Button check", user);
    console.log("what is group: ", group)

    this.http.put(`http://localhost:3000/api/user/${user.id}/group/${group.group}/role`, {}).subscribe((updatedUser: any) => {
      const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
      this.usersJSON[index] = updatedUser
    })
  }
}
