import { Injectable, signal, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket as ClientSocket } from 'socket.io-client';

// Signal (with capital S) is for read-only.

const SERVER_URL = "http://localhost:3000"
const VIDEO_SERVER_URL = "https://s5330262.elf.ict.griffith.edu.au:4443";
const PEER_SERVER_HOST = "s5330262.elf.ict.griffith.edu.au";
const PEER_SERVER_PORT = 3001;

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
  private videoSocket: any;
  messages = signal<ChatMessage[]>([])
  usersInChannel = signal<string[]>([]);
  currentChannel= signal<string | null>(null);
  constructor () {}

  // local socket for chat
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
      this.socket.on("joinChannel", ({ userID, username }: { userID: string, username: string }) => {
        this.usersInChannel.update(currentUsers => [...currentUsers, userID]);

        // message for when user join a channel
        const joinMsg: ChatMessage = {
            messageID: `sys-${Date.now()}`,
            userID: "system",
            groupID: this.currentChannel()!,
            channelID: this.currentChannel()!,
            message: `${username} joined the channel`,
            images: [],
            datetime: new Date().toString()
        };
        this.messages.update(msgs => [...msgs, joinMsg]);
      })

      // leave channel
      this.socket.on('leaveChannel', ({ userID, username }: { userID: string, username: string }) =>{
        this.usersInChannel.update(currentUsers => currentUsers.filter(user => user !== userID))

        // message for when user leave a channel
        const joinMsg: ChatMessage = {
            messageID: `sys-${Date.now()}`,
            userID: "system",
            groupID: this.currentChannel()!,
            channelID: this.currentChannel()!,
            message: `${username} left the channel`,
            images: [],
            datetime: new Date().toString()
        };
        this.messages.update(msgs => [...msgs, joinMsg]);
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

  // ELF SOCKET
    initVideoSocket() {
    this.videoSocket = io(VIDEO_SERVER_URL);
    this.videoSocket.on('connect', () => {
      console.log('Connected to ELF video server:', this.videoSocket.id);
    });
  }

  peerID(message: string){
    this.socket.emit("peerID", message)
  }

  getPeerID(){
    return new Observable(observer => {
      this.socket.on("peerID", (data: string) => {
        observer.next(data)
      })
    })
  }
  
}
