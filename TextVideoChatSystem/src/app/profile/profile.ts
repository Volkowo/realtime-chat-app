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

  // returns a list/array of channel of a group
  getChannelById(groupID: string){
    if(this.groupsJSON){
      const group = this.groupsJSON.find((group: any) => group.groupID === groupID)
      return group ? group.channels : "Unknown";
    } else {
      
    }
  }

  // returns a list of users in a group
  getUserById(groupID: string){
    if(this.groupsJSON){
      const group = this.groupsJSON.find((group: any) => group.groupID === groupID)
      return group ? group.users : "Unknown";
    } else {
      
    }
  }

  // returns the username of a user based on their memberID
  getUsernameById(memberID: string){
    if(this.usersJSON){
      const user = this.usersJSON.find((user: any) => user.id === memberID)
      return user ? user.username : "Unknown";
    }
  }

  // get users that are NOT in the group
  getUserNotInGroup(groupID: string){
    if(this.usersJSON){
      const listOfUsers =  this.getUserById(groupID);

      return this.usersJSON.filter((user: any) => !listOfUsers.includes(user.id))
    } else {
      
    }
  }

  // Check if user is a chatUser or not
  checkGroupAdminRole(user: any){
    // console.log("User groups:", user.groups);
    const nonAdmin = user.groups.filter((group: any) => group.role == "chatUser");
    // console.log(nonAdmin);
    return nonAdmin;
  }

  // Check if user is a superAdmin or not
  checkSuperAdminRole(user: any){
    // console.log("User groups:", user.groups);
    const nonSuperAdmin = user.groups.filter((group: any) => group.role != "superAdmin");
    // console.log(nonSuperAdmin);
    return nonSuperAdmin;
  }

  // check if user is superadmin and/or groupadmin
  isSuperOrGroupAdmin(group: any){
    return group.role == "groupAdmin" || group.role == "superAdmin"
  }

  // add user to a group
  addUserToGroup(groupID: string, userID: string){
    this.http.put(`http://localhost:3000/api/group/${groupID}/add/${userID}`, {}).subscribe((res: any) => {
      const updatedUser = res.user;
      const updatedGroup = res.group;

      // Update usersJSON and groupsJSON
      const userIndex = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
      console.log("user index", userIndex)
      this.usersJSON[userIndex] = updatedUser

      const groupIndex = this.groupsJSON.findIndex((group: any) => group.groupID == updatedGroup.groupID)
      console.log("group index", groupIndex)
      this.groupsJSON[groupIndex] = updatedGroup
    })
  }

  //Promote to GroupAdmin
  checkUser(user: any, group: any, newRole: any){
    console.log("Button check", user);
    console.log("what is group: ", group)

    this.http.put(`http://localhost:3000/api/user/${user.id}/group/${group.group}/role`, {role: newRole}).subscribe((updatedUser: any) => {
      const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
      this.usersJSON[index] = updatedUser
    })
  }

  // Promote to SuperAdmin
  promoteToSuperAdmin(userID: any){
      this.http.put(`http://localhost:3000/api/user/${userID}/superAdminPromotion`, {}).subscribe((updatedUser: any) => {
        const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
        this.usersJSON[index] = updatedUser
    })
  }
}
