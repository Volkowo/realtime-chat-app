class Channel{
    constructor(channelName){
        this.channelName = channelName;
        this.messages = [];
    }

    addMessage(userID, message){
        this.messages.push({
            datetime: new Date(),
            userID: userID,
            message: message
        })
    }
}