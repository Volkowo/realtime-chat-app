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
  imports: [FormsModule, RouterModule, CommonModule, PromoteModal],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  constructor(private router: Router, private http: HttpClient) {
  }

  user: any;
  userJSON: any;
  usersJSON: any;
  groupsJSON: any;
  requestsJSON: any;
  membershipJSON: any;
  channelJSON: any;
  newChannel: string = "";
  newGroup: string = "";
  newGroup_channel: string = "";
  kickBanReason: string = "";
  selectedUser: string = "";
  applyGroup: string = "";
  reasonToJoin: string = "";
  showError: boolean = false;
  currentView: string = "";
  nonUsers: any[] = [];
  groupUserIsIn: any[] = []
  avatar: string = "";
  image: any;
  previewImage: any

  ngOnInit() {
    this.user = (localStorage.getItem("user"))
    if (this.user){
      this.userJSON = JSON.parse(this.user);
      // console.log("USER: ", this.user)
      
      this.http.get<UserModel>(`http://localhost:3000/api/users`).subscribe((users) => {
        this.usersJSON = users;
        // console.log(this.usersJSON); 
      })

      this.http.get<GroupModel[]>(`http://localhost:3000/api/groups`).subscribe((groups) => {
        this.groupsJSON = groups;
        // console.log(this.groupsJSON); 
      })

      this.http.get<JoinRequestModel[]>(`http://localhost:3000/api/requests`).subscribe((requests) => {
        this.requestsJSON = requests;
        // console.log(this.requestsJSON); 
      })

      this.http.get<ChannelModel[]>(`http://localhost:3000/api/channels`).subscribe((channels) => {
        this.channelJSON = channels;
        // console.log(this.channelJSON); 
      })

      this.http.get<any>(`http://localhost:3000/api/membership`).subscribe((membership) => {
        this.membershipJSON = membership;
        // console.log(this.membershipJSON); 
      })

      this.http.get<any[]>(`http://localhost:3000/api/groupsNotIn/${this.userJSON.id}`, {}).subscribe(res => {
        // console.log(res);
        this.nonUsers = res;
      })

      this.http.get<any[]>(`http://localhost:3000/api/groupsIn/${this.userJSON.id}`, {}).subscribe(res => {
        // console.log("GROUP USER IS IN: ", res);
        this.groupUserIsIn = res;
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

  hasAdmin(userID: string){
    if(this.membershipJSON){
      return this.membershipJSON.filter((membership: any) => (membership.userID == userID) && (membership.role == 'groupAdmin' || membership.role == 'superAdmin'))
    }
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
      const channels = this.channelJSON.filter((channel: any) => channel.groupID === groupID);
      // console.log("Channels: ", channels);
      return channels.length ? channels : [];
    } else {
      
    }
  }

  // returns a list of users in a group
  getUserById(groupID: string){
    // console.log("GROUP ID: ", groupID);
    if(this.membershipJSON){
      const group = this.membershipJSON.filter((membership: any) => membership.groupID === groupID)
      // console.log("MEMBERSHIP: ", group);
      return group ? group : "Unknown";
    } else {
      
    }
  }

  // Return the user's role
  getUserRoles(groupID: string, userID: string){
    if(this.membershipJSON){
      const role = this.membershipJSON.find((membership: any) => membership.userID === userID && membership.groupID === groupID)

      return role ? role.role : "unknown"
    }
  }

  // returns the username of a user based on their memberID
  getUsernameById(memberID: string){
    if(this.usersJSON){
      const user = this.usersJSON.find((user: any) => user.id === memberID)
      // console.log("USER?! :", user.username)
      return user ? user.username : "Unknown";
    }
  }

  // returns the group the user is not in
  getGroupUserIsNotIn(userID: string){
    // this.http.get<any[]>(`http://localhost:3000/api/groupsNotIn/${userID}`, {}).subscribe(res => {
    //   console.log(res);
    //   this.nonUsers = res;
    // })
    // return this.nonUsers;
  }

  // get users that are NOT in the group
  getUserNotInGroup(groupID: string){
    if(this.membershipJSON){
      const usersInGroup = this.getUserById(groupID);
      const userIDs = usersInGroup.map((user: any) => user.userID)

      // console.log(userIDs);

      const usersNotInGroup = this.usersJSON.filter((user: any) => 
        !userIDs.includes(user.id)
      )

      // console.log("NOT IN GROUP: ", usersNotInGroup);
      return usersNotInGroup;
    }
  }

  // get users that are in the group
  getUserInGroup(groupID: string){
    if(this.membershipJSON){
      const usersInGroup = this.getUserById(groupID);
      // console.log("wait what: ", usersInGroup)
      return usersInGroup
    }
  }

  // Check if user FROM AN ARRAY is a chatUser or not
  checkGroupAdminRole(userID: string){
    console.log("User ID:", userID);

    if(this.membershipJSON){
      const nonAdmin = this.membershipJSON.filter((membership: any) => membership.userID == userID && membership.role == "chatUser")
      return nonAdmin;
    }
    // console.log(nonAdmin);
  }

  // Check if user FROM AN ARRAY is a superAdmin or not
  // checkSuperAdminRole(userID: any){
  //   // console.log("User groups:", user.groups);
  //   const nonSuperAdmin = user.groups.filter((group: any) => group.role != "superAdmin");
  //   return nonSuperAdmin;
  // }

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
  isSuperOrGroupAdmin(role: any){
    return role == "groupAdmin" || role == "superAdmin"
  }

  // add user to a group
  addUserToGroup(groupID: string, userID: string){
    this.http.put(`http://localhost:3000/api/group/${groupID}/add/${userID}`, {}).subscribe((res: any) => {
      const updatedMembership = res.updatedMembership;
      const updatedRequests = res.updatedRequests;

      // Update membershipJSON and requestJSON
      this.membershipJSON = updatedMembership;
      this.requestsJSON = updatedRequests;

      this.closeModal('addUser' + groupID)
    })
  }

  // add new channel to an existing group
  addChannel(groupID: string, newChannel: string){
    this.http.put(`http://localhost:3000/api/group/${groupID}/addChannel/${newChannel}`, {}).subscribe(res => {
      // console.log(res)
      this.channelJSON = res
      this.newChannel = ""

      this.closeModal('addChannel' + groupID)
    })
  }

  // create new group
  createNewGroup(newGroup: string, newGroup_channel: string, userID: string) {
    this.http.post(`http://localhost:3000/api/group/newGroup/${userID}/${newGroup}/${newGroup_channel}`, {}).subscribe((res: any) => {

      // Get groups from backend
      this.groupsJSON = res.updatedGroup
      this.membershipJSON = res.updatedMembership
      this.usersJSON = res.updatedUsers
      this.channelJSON = res.updatedChannel

      const updatedUserFull = this.usersJSON.find((u: any) => u.id == userID);
      this.userJSON = updatedUserFull;
      localStorage.setItem("user", JSON.stringify(updatedUserFull));

      this.http.get<any[]>(`http://localhost:3000/api/groupsIn/${userID}`).subscribe(res => {
        this.groupUserIsIn = res;
      });


      this.closeModal('newGroup')
    });
  }

  //Promote to GroupAdmin
  checkUser(userID: any, groupID: any, newRole: any){
    console.log("Button check", userID);
    console.log("what is group: ", groupID)

    
      this.http.put(`http://localhost:3000/api/user/${userID}/group/${groupID}/role`, {role: newRole}).subscribe((res: any) => {
        this.usersJSON = res.updatedUsers;
        this.membershipJSON = res.updatedMembership;
      })
    
  }

  // Promote to SuperAdmin
  promoteToSuperAdmin(userID: any){
      this.http.put<UserModel>(`http://localhost:3000/api/user/${userID}/superAdminPromotion`, {}).subscribe((res: any) => {
        this.usersJSON = res.updatedUser;
        this.membershipJSON = res.updatedMembership;

        this.closeModal("manageUser" + userID)
    })
  }

  // Delete Group
  deleteGroup(groupID: string){
    this.http.delete(`http://localhost:3000/api/group/${groupID}/remove`, {}).subscribe((res: any) => {
      this.groupsJSON = res.updatedGroup;
      this.membershipJSON = res.updatedMembership;
      this.channelJSON = res.updatedChannel

      this.groupUserIsIn = this.groupUserIsIn.filter(g => g.groupID !== groupID);
      this.closeModal('deleteGroup' + groupID)
    })
  }

  // Delete Channel
  deleteChannel(groupID: string, channelID: string){
    this.http.delete(`http://localhost:3000/api/group/${groupID}/channel/${channelID}/remove`, {}).subscribe((updatedChannel: any) => {
      this.channelJSON = updatedChannel
      this.closeModal('deleteChannel' + channelID)
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
            this.membershipJSON = res
            this.closeModal('manageUser' + groupID)
          })
          break;
        }
        case "ban":{
          console.log(`${action} the selected user! (${selectedUser})`)
          this.http.post(`http://localhost:3000/api/group/${groupID}/user/${selectedUser}/ban`, {kickBanReason}).subscribe((res: any) => {
            this.groupsJSON = res.updatedGroup;
            this.membershipJSON = res.updatedMembership;
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
      this.membershipJSON = res.updatedMembership;
      this.requestsJSON = res.updatedRequest;
    })
  }

  checkBannedUser(userID: string, groupID: string){
    if(this.groupsJSON){
      // console.log("USER ID: ", userID , " | GROUP ID: ", groupID)
      const isUserBanned = this.groupsJSON.find((group: any) => group.bannedUsers.includes(userID) && group.groupID == groupID)

      return isUserBanned;
    }
  }

  deleteAccount() {
    const userID = this.userJSON.id;
    this.http.delete(`http://localhost:3000/api/user/${userID}/delete`).subscribe({
      next: (res: any) => {
        // Clear localStorage and redirect to login
        localStorage.removeItem("user");
        this.closeModal('deleteAccount')
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Failed to delete account:", err);
      }
    });
  }

  deleteUser(userID: string){
    this.http.delete(`http://localhost:3000/api/user/${userID}/delete`).subscribe({
      next: (res: any) => {
        this.usersJSON = this.usersJSON.filter((user: any) => user.id !== userID);
        this.requestsJSON = this.requestsJSON.filter((request: any) => request.userID !== userID);
        this.closeModal('deleteUser' + userID);
        alert("User deleted!");
      },
      error: (err) => {
        console.error("Failed to delete account:", err);
      }
    });
  }

  saveProfile(){
    console.log("gurt: yo")
  }

  // change profile picutre
  changeProfilePicture(userID: string){
    var formData = new FormData();
    if(this.image){
      formData.append('profileImage', this.image)
      this.http.post(`http://localhost:3000/api/update/${userID}`, formData).subscribe((res: any) => {
          console.log(res);
          this.userJSON = res;
          localStorage.setItem("user", JSON.stringify(res));
      })
    }
  }

  onFileSelected(event: any){
    if(event.target.value){
      this.image = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result; // set preview
      };
      reader.readAsDataURL(this.image);
    }
  }
  
  getCurrentUserMembership(userID: string){
    return this.membershipJSON.filter((membership: any) => membership.userID == userID)
  }

  getAvatarURL(user: any){
    return `http://localhost:3000/${user.avatar}`
  }

}
