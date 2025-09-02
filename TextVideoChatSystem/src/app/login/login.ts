import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserModel } from '../models/users';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  username = "";
  pass = "";

  constructor(private router: Router, private http: HttpClient){}

  ngOnInit(){
    const testCheckUser = localStorage.getItem("users")
    const testCheckGroup = localStorage.getItem("groups")

    console.log(testCheckUser)
    console.log(testCheckGroup)
  }

  resetInput(){
    this.username = "";
    this.pass = "";
  }

  checkLogin(){
    this.http.post<UserModel>('http://localhost:3000/api/auth', {username: this.username, pass: this.pass}).subscribe((user: UserModel) => {
      if (user.signedIn){
          const userString = JSON.stringify(user);
          localStorage.setItem("user", userString);
          console.log("Logged in user: ", userString)
          this.router.navigate(['/group'])
      } else {
        alert("Invalid credentials!");
      }
    })
  }
}
