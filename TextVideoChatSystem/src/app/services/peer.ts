import { Injectable } from '@angular/core';
import {Peer as peer} from 'peerjs'
import {v4 as uuidv4} from 'uuid'

@Injectable({
  providedIn: 'root'
})
export class Peer {
  myPeerID = uuidv4();
  myPeer: any
  streamCamera: any
  streamScreen: any

  constructor(){
    this.myPeer = new peer(this.myPeerID, {
      host: "s5330262.elf.ict.griffith.edu.au",
      secure: true,
      port: 3001,
      path: "/"
    })
  }
  
}
