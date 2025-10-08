import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Socket } from '../services/socket';
import { Peer } from '../services/peer';

interface VideoElement{
  muted: boolean,
  srcObject: MediaStream,
  userID: string
}

const gdmOptions = {
  video: true,
  audio: {
    echoCancellation: true,
    noiseSupression: true,
    sampleRate: 44100
  }
}

const gumOptions = {
  audio: true,
  video: {
    width: {ideal: 640},
    height: {ideal: 360}
  }
}

@Component({
  selector: 'app-videos',
  imports: [CommonModule],
  templateUrl: './videos.html',
  styleUrl: './videos.css'
})
export class Videos implements OnInit{
  isCallStarted = false;
  ownID: any;
  currentCall: any
  peerList: string[];
  currentStream: any
  videos: VideoElement[] = []
  calls: any = []

  constructor(private socketService: Socket, private peerService: Peer){
    this.peerList = [];
    this.ownID = this.peerService.myPeerID;
  }

  ngOnInit() {
    this.socketService.initVideoSocket();
    this.socketService.getPeerID().subscribe((peerID: any) => {
      if (peerID !== this.ownID) {
        this.peerList.push(peerID);
        // try calling them immediately
        const call = this.peerService.myPeer.call(peerID, this.currentStream, {
          metadata: { peerID: this.ownID }
        });
        call.on('stream', (remoteStream: MediaStream) => {
          this.addOtherUserVideo(peerID, remoteStream);
        });
      }
    });
  }

  addMyVideo(stream: MediaStream){
    this.videos.push({
      muted: true,
      srcObject: stream,
      userID: this.peerService.myPeerID
    })
  }

  addOtherUserVideo(userID: string, stream: MediaStream){
    let newVideo = {
      muted: false,
      srcObject: stream,
      userID
    }

    let existing = false;
    console.log(this.videos, userID)

    this.videos.forEach((v, i, newVideos) => {
      if(v.userID == userID){
        existing = true;
        newVideos[i] = newVideo;
      }
    })

    if(existing == false){
      this.videos.push(newVideo)
    }
  }

  async streamCamera() {
    this.currentStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.addMyVideo(this.currentStream);

    if (this.peerService.myPeer.disconnected) {
      this.peerService.myPeer.reconnect();
    }

    this.answerIncomingCalls(this.currentStream);  
    this.socketService.peerID(this.peerService.myPeerID);
    this.isCallStarted = true;
  }

  async streamScreen(){
    this.currentStream = await navigator.mediaDevices.getDisplayMedia(gdmOptions);
    this.addMyVideo(this.currentStream);
    if (this.peerService.myPeer.disconnected) {
      this.peerService.myPeer.reconnect();
    }

    this.answering(this.currentStream);
    this.isCallStarted = true;
  }

  answering(stream: MediaStream) {
    this.peerService.myPeer.on('call', (call: any) => {
      call.answer(stream); // Answer with our local stream
      call.on('stream', (remoteStream: MediaStream) => {
        console.log('Receiving remote stream from peer');
        const callerID = call.metadata?.peerID || 'unknown';
        this.addOtherUserVideo(callerID, remoteStream);
      });
  });
}

answerIncomingCalls(stream: MediaStream) {
  this.peerService.myPeer.on('call', (call: any) => {
    console.log('Incoming call from', call.metadata?.peerID);
    call.answer(stream); 
    call.on('stream', (remoteStream: MediaStream) => {
      const remoteID = call.metadata?.peerID || call.peer;
      console.log('Receiving remote stream from', remoteID);
      this.addOtherUserVideo(remoteID, remoteStream);
    });
  });
}

  calling(peerID: string){
    if(confirm(`Do you want to call ${peerID}`)){
      const call = this.peerService.myPeer.call(peerID, this.currentStream, {
        metadata: {peerID: this.ownID}
      });

      this.currentCall = call;
      this.calls.push(call)

      console.log(call)
      call.on('stream', (otherUserVideoStream: MediaStream) => {
        console.log("Receiving other user stream after connection")
        this.addOtherUserVideo(peerID, otherUserVideoStream)
      })

      call.on('close', () =>{
        this.videos = this.videos.filter((video) => video.userID !== peerID)
        this.calls = this.calls.filter((c: any) => c !== call)
      })
    }
  }
}
