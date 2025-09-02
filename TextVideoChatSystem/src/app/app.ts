import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Seed } from './services/seed';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('TextVideoChatSystem');
  constructor(private seedService: Seed){}

  ngOnInit(){
    this.seedService.runSeed();
  }
}
