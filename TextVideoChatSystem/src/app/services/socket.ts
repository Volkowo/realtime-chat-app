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
  images: [];  // err string[] since multiple images?
  datetime: string;  // We convert the date to string
}

@Injectable({
  providedIn: 'root'
})

export class Socket {
  private socket: any;
  messages = signal<ChatMessage[]>([])
  usersInChannel = signal<string[]>([]);
  currentChannel= signal<string | null>(null);
  constructor () {}

  initSocket(){
    this.socket = io(SERVER_URL);
    if(this.socket){
      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
      });
      // get & update message
      this.socket.on("message", (message: ChatMessage)=>{
        this.messages.update(oldMessages => [...oldMessages, message]);
        console.log("Message received on socket:", message);
      })

      // get & update images
      this.socket.on("image", (image: any) =>{
        this.messages.update(oldMessages => [...oldMessages, image]);
      })

      // join channel
      this.socket.on("joinChannel", (userID: string) => {
        this.usersInChannel.update(currentUsers => [...currentUsers, userID]);
      })

      // leave channel
      this.socket.on('leaveChannel', (userID: string) =>{
        this.usersInChannel.update(currentUsers => currentUsers.filter(user => user !== userID))
      })

    } else {
      ()=>{this.socket.disconnect();}
    }
  }

  send(message: string, channelID: string){
    this.socket.emit("message", {message, channelID});
    console.log(`${channelID} got message ${message}`)
  }

  joinChannel(channelID: string, userID: string){
    if(this.socket){
      console.log(`${userID} joining ${channelID}`)
      this.socket.emit("joinChannel", {channelID, userID})
    }
  }

  leaveChannel(channelID: string, userID: string){
    if(this.socket){
      this.socket.emit("leaveChannel", {channelID, userID})
      // this.socket.disconnect();
    }
  }

  
}
