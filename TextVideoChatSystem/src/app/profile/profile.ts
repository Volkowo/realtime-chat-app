import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PromoteModal } from "../promote-modal/promote-modal";
import { UserModel } from '../models/users';
import { GroupModel } from '../models/groups';
import { ChannelModel } from '../models/channels';
import { MessageModel } from '../models/messages';
import { JoinRequestModel } from '../models/joinRequest'; 
import { BannedUserModel } from '../models/bannedUsers';   


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
  requestsJSON: any;
  newChannel: string = "";
  newGroup: string = "";
  newGroup_channel: string = "";
  kickBanReason: string = "";
  selectedUser: string = "";
  applyGroup: string = "";
  reasonToJoin: string = "";
  showError: boolean = false;
  currentView: string = "";

  ngOnInit() {
      this.user = (localStorage.getItem("user"))
      if (this.user){
          this.userJSON = JSON.parse(this.user);
          console.log("USER: ", this.user)
          
          this.http.get<UserModel>(`http://localhost:3000/api/users`).subscribe((users) => {
            this.users = JSON.stringify(users);
            console.log("Users: ", this.users)
            this.usersJSON = users;
            console.log(this.usersJSON); 
          })

          this.http.get<GroupModel[]>(`http://localhost:3000/api/groups`).subscribe((groups) => {
            this.groups = JSON.stringify(groups);
            console.log("Groups: ", this.groups)
            this.groupsJSON = groups;
            console.log(this.groupsJSON); 
          })

          this.http.get<JoinRequestModel[]>(`http://localhost:3000/api/requests`).subscribe((requests) => {
            this.requestsJSON = requests;
            console.log(this.requestsJSON); 
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

setCurrentView(currentView: string){
  this.currentView = currentView;
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

  // returns the group the user is not in
  getGroupUserIsNotIn(userID: string){
    return this.groupsJSON.filter((group: any) => !group.users.includes(userID))
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

  // Check if user FROM AN ARRAY is a chatUser or not
  checkGroupAdminRole(user: any){
    // console.log("User groups:", user.groups);
    const nonAdmin = user.groups.filter((group: any) => group.role == "chatUser");
    // console.log(nonAdmin);
    return nonAdmin;
  }

  // Check if user FROM AN ARRAY is a superAdmin or not
  checkSuperAdminRole(user: any){
    // console.log("User groups:", user.groups);
    const nonSuperAdmin = user.groups.filter((group: any) => group.role != "superAdmin");
    // console.log(nonSuperAdmin);
    return nonSuperAdmin;
  }

  isUserSuperAdmin(): boolean {
    return this.userJSON.roles.includes('superAdmin');
  }

  isUserGroupAdmin(): boolean {
    return this.userJSON.roles.includes('groupAdmin');
  }

  isUserChatUser(): boolean {
    return this.userJSON.roles.includes('chatUser');
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

      this.requestsJSON = this.requestsJSON.filter((r: any) => 
        !(r.userID === updatedUser.id && r.groupID === updatedGroup.groupID)
      );

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

    
      this.http.put(`http://localhost:3000/api/user/${user.id}/group/${group.group}/role`, {role: newRole}).subscribe((updatedUser: any) => {
        const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
        this.usersJSON[index] = updatedUser
      })
    
  }

  // Promote to SuperAdmin
  promoteToSuperAdmin(userID: any){
      this.http.put<UserModel>(`http://localhost:3000/api/user/${userID}/superAdminPromotion`, {}).subscribe((updatedUser) => {
        const index = this.usersJSON.findIndex((user: any) => user.id == updatedUser.id)
        this.usersJSON[index] = updatedUser

        this.closeModal("manageUser" + userID)
    })
  }

  // Delete Group
  deleteGroup(groupID: string){
    this.http.delete(`http://localhost:3000/api/group/${groupID}/remove`, {}).subscribe((res: any) => {
      this.closeModal('deleteGroup' + groupID)
      this.usersJSON = res.users;
      this.groupsJSON = res.groups;

      // update the logged-in user
      const updatedUser = this.usersJSON.find((u: any) => u.id == this.userJSON.id);
      if (updatedUser) {
        this.userJSON = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));

        this.closeModal("deleteGroup" + groupID)
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

  apply(groupID: string, userID:string, reasonToJoin: string){
    if(!groupID){
      this.showError = true
    } else {
      this.showError = false

    this.http.post(`http://localhost:3000/api/request/join/${groupID}/${userID}`, {reasonToJoin}).subscribe((requests: any) => {
        this.requestsJSON = requests;

        this.applyGroup = ""
        this.reasonToJoin = ""
      })
    }
  }

  manageRequest(groupID: string, userID: string, requestID: string, action: string){
    this.http.put(`http://localhost:3000/api/request/join/${groupID}/${userID}/${requestID}/${action}`, {}).subscribe((res: any) => {
      this.usersJSON = res.users;
      this.groupsJSON = res.groups;
      this.requestsJSON = res.requests;

      const updatedUser = this.usersJSON.find((u: any) => u.id == this.userJSON.id);
      if (updatedUser) {
        this.userJSON = updatedUser;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    })
  }


}
