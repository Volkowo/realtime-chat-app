import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = "";
  pass = "";

  constructor(private router: Router, private http: HttpClient){}

  resetInput(){
    this.email = "";
    this.pass = "";
  }

  checkLogin(){
    this.http.post('http://localhost:3000/api/auth', {email: this.email, pass: this.pass}).subscribe((user: any) => {
      if (user.valid){
          const userString = JSON.stringify(user);
          localStorage.setItem("user", userString);
          this.router.navigate(['/group'])
      } else {
        alert("Invalid credentials!");
      }
    })
  }
}
