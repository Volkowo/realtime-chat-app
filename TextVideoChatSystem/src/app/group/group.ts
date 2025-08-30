import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-group',
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './group.html',
  styleUrl: './group.css'
})
export class Group implements OnInit {
  constructor(private router: Router, private http: HttpClient) {

  }
  user: any;
  userJSON: any;
  groups: any;

  ngOnInit(){
    this.user = (localStorage.getItem("user"))
    if (this.user){
        this.userJSON = JSON.parse(this.user);
        this.http.get(`http://localhost:3000/api/groups/${this.userJSON.id}`).subscribe((groups: any) => {
          const groupsString = JSON.stringify(groups)
          console.log("GROUP: " + groupsString);
        })
    } else {
      console.log("User not logged in!")
    }
  }



  logOut(){
    localStorage.clear();
    alert("Logged out!")
  }
}
