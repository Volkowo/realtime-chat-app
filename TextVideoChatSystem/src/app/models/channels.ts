import { MessageModel } from "./messages"

export class ChannelModel{
    constructor(
        public channelID: string, 
        public channelName: string, 
        public messages: MessageModel[] = []
    ){}

    addMessage(userID: string, message: string){
        this.messages.push(new MessageModel(userID, message))
    }
}