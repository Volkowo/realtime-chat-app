import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../models/users';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = "";
  pass = "";

  constructor(private router: Router, private http: HttpClient){}

  resetInput(){
    this.username = "";
    this.pass = "";
  }

  checkLogin(){
    this.http.post<User>('http://localhost:3000/api/auth', {username: this.username, pass: this.pass}).subscribe((user: any) => {
      if (user.signedIn){
          const userString = JSON.stringify(user);
          localStorage.setItem("user", userString);
          this.router.navigate(['/group'])
      } else {
        alert("Invalid credentials!");
      }
    })
  }
}
