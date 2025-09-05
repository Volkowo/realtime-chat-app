import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PromoteModal } from "../promote-modal/promote-modal";

declare var bootstrap: any; 

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
  newChannel: string = "";
  newGroup: string = "";
  newGroup_channel: string = "";
  kickBanReason: string = "";
  selectedUser: string = "";
  showError: boolean = false

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

closeModal(modalId: string) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
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

  // Return the user's role
  getUserRoles(groupID: string, userID: string){
    if(this.usersJSON){
      const user = this.usersJSON.find((user: any) => user.id === userID)
      const role = user.groups.find((group: any) => group.group === groupID)

      return role ? role.role : "unknown"
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

  // get users that are in the group
  getUserInGroup(groupID: string){
    const listOfUsers =  this.getUserById(groupID);

    return this.usersJSON.filter((user: any) => listOfUsers.includes(user.id))
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

      this.closeModal('addUser' + groupID)
    })
  }

  // add new channel to an existing group
  addChannel(groupID: string, newChannel: string){
    this.http.put(`http://localhost:3000/api/group/${groupID}/addChannel/${newChannel}`, {}).subscribe((updatedGroup: any) => {
      const index = this.groupsJSON.findIndex((group: any) => group.groupID == updatedGroup.groupID)
      this.groupsJSON[index] = updatedGroup
      console.log("New channel: ", updatedGroup)

      this.closeModal('addChannel' + groupID)
    })
  }

  // create new group
  createNewGroup(newGroup: string, newGroup_channel: string, userID: string) {
    this.http.post(`http://localhost:3000/api/group/newGroup/${userID}/${newGroup}/${newGroup_channel}`, {}).subscribe((res: any) => {
      const updatedUser = res.user;

      // Get groups from backend
      this.http.get(`http://localhost:3000/api/groups`).subscribe((groups: any) => {
        this.groupsJSON = groups;
      });

      // Get users from backend
      this.http.get(`http://localhost:3000/api/users`).subscribe((users: any) => {
        this.usersJSON = users;

        // update user again just to be sure idk
        const updatedUserFull = users.find((u: any) => u.id == updatedUser.id);
        this.userJSON = updatedUserFull;
        localStorage.setItem("user", JSON.stringify(updatedUserFull));
      });

      this.closeModal('newGroup')
    });
  }

  //Promote to GroupAdmin
  checkUser(user: any, group: any, newRole: any){
    console.log("Button check", user);
    console.log("what is group: ", group)

    if(this.newChannel){
      this.http.put(`http://localhost:3000/api/user/${user.id}/group/${group.group}/role`, {role: newRole}).subscribe((updatedUser: any) => {
        const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
        this.usersJSON[index] = updatedUser
      })
    }
  }

  // Promote to SuperAdmin
  promoteToSuperAdmin(userID: any){
      this.http.put(`http://localhost:3000/api/user/${userID}/superAdminPromotion`, {}).subscribe((updatedUser: any) => {
        const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
        this.usersJSON[index] = updatedUser
    })
  }

  // Delete Group
  deleteGroup(groupID: string){
    this.http.delete(`http://localhost:3000/api/group/${groupID}/remove`, {}).subscribe((res: any) => {
      this.closeModal('deleteGroup' + groupID)
      this.usersJSON = res.users;
      this.groupsJSON = res.groups;

      // update the logged-in user from fresh usersJSON
      const updatedUser = this.usersJSON.find((u: any) => u.id == this.userJSON.id);
      if (updatedUser) {
        this.userJSON = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    })
  }

  // Delete Channel
  deleteChannel(groupID: string, channelID: string){
    this.http.delete(`http://localhost:3000/api/group/${groupID}/channel/${channelID}/remove`, {}).subscribe((updatedGroup: any) => {
      this.closeModal('deleteChannel' + channelID)
        const index = this.groupsJSON.findIndex((group: any) => group.groupID == updatedGroup.groupID)
        this.groupsJSON[index] = updatedGroup
    })
  }

  manageUser(selectedUser: string, groupID: string, kickBanReason: string, action: string){
    if(selectedUser == ""){
      this.showError = true;
    } else {
      this.showError = false;
      
      switch(action){
        case "kick":{
          console.log(`${action} the selected user! (${selectedUser})`)
          this.http.delete(`http://localhost:3000/api/group/${groupID}/user/${selectedUser}/kick`, {}).subscribe((res: any) => {
            this.groupsJSON = res.groups;
            this.usersJSON = res.users;

            this.selectedUser = ""
            this.closeModal('manageUser' + groupID)
          })
          break;
        }
        case "ban":{
          console.log(`${action} the selected user! (${selectedUser})`)
          this.http.post(`http://localhost:3000/api/group/${groupID}/user/${selectedUser}/ban`, {kickBanReason}).subscribe((res: any) => {
            this.groupsJSON = res.groups;
            this.usersJSON = res.users;

            this.selectedUser = ""
            this.closeModal('manageUser' + groupID)
          })
          break;
        }
        default:{
          console.log("what the helly youre not supposed to break this");

          this.selectedUser = ""
          this.closeModal('manageUser' + groupID)
          break;
        }
      }


    }
  }


}
