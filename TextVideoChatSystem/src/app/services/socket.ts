import { Injectable, signal } from '@angular/core';
import { io } from 'socket.io-client';

const SERVER_URL = "http://localhost:3000"

interface ChatMessage{
  userID: string,
  content: string
}

@Injectable({
  providedIn: 'root'
})
export class Socket {
  private socket: any;
  messages = signal<ChatMessage[]>([]);
  users = signal<string[]>([]);
  currentChannel = signal<string | null>(null);
  constructor () {}

  initSocket(){
    this.socket = io(SERVER_URL);
    return ()=>{this.socket.disconnect();}
  }
  
}
