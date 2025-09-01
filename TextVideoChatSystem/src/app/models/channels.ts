export class Channel{
    constructor(
        public channelID: string, 
        public channelName: string, 
        public messages: any[] = []
    ){}

    addMessage(userID: string, message: string){
        this.messages.push({
            datetime: new Date(),
            userID: userID,
            message: message
        })
    }
}