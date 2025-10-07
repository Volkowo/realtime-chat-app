import { Injectable, signal, Signal } from '@angular/core';
import { io, Socket as ClientSocket } from 'socket.io-client';

// Signal (with capital S) is for read-only.

const SERVER_URL = "http://localhost:3000"

interface ChatMessage{
  messageID: string;
  userID: string;
  groupID: string;
  channelID: string;
  message: string;
  images: string[];  // err string[] since multiple images?
  datetime: string;  // We convert the date to string
}

@Injectable({
  providedIn: 'root'
})

export class Socket {
  private socket!: ClientSocket;
  messages = signal<ChatMessage[]>([])
  usersInChannel = signal<string[]>([]);
  currentChannel= signal<string | null>(null);
  constructor () {}

  initSocket(){
    this.socket = io(SERVER_URL);
    if(this.socket){
      // get & update message
      this.socket.on("message", (message)=>{
        this.messages.update(oldMessages => [...oldMessages, message]);
      })

      // get & update images
      this.socket.on("image", (image) =>{
        this.messages.update(oldMessages => [...oldMessages, image]);
      })

      // join channel
      this.socket.on("joinChannel", (userID) =>{
        this.usersInChannel.update(currentUsers => [...currentUsers, userID]);
      })

      // leave channel
      this.socket.on('leaveChannel', (userID) =>{
        this.usersInChannel.update(currentUsers => currentUsers.filter(user => user !== userID))
      })

    } else {
      ()=>{this.socket.disconnect();}
    }
  }

  send(message: string){
    this.socket.emit("message", message);
  }

  joinChannel(channelID: string, userID: string){
    if(this.socket){
      this.socket.emit("joinChannel", {channelID, userID})
    }
  }

  leaveChannel(channelID: string, userID: string){
    if(this.socket){
      this.socket.emit("leaveChanel", {channelID, userID})
      this.socket.disconnect();
    }
  }

  
}
