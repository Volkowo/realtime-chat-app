import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserModel } from '../models/users';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = "";
  password = "";
  email = "";

  constructor(private router: Router, private http: HttpClient){}

  ngOnInit(){
    this.username = "";
    this.password = "";
    this.email = "";
  }

  register(username: string, password: string, email: string){
    if(username && password && email){
      this.http.post('http://localhost:3000/api/register', {username, password, email}).subscribe((res: any) => {
        if(res.register){
          alert("Registration successful!");
          this.router.navigate(['/login']);

          this.username = "";
          this.password = "";
          this.email = "";
        } else {
          alert("Username or email already exists. Please try again.");
        }
      })
    } else {
      alert("Input fields cannot be empty.")
    }


  }
}
