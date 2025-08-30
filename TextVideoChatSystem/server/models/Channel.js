class Channel{
    constructor(channelID, channelName, messages = []){
        this.channelID = channelID
        this.channelName = channelName;
        this.messages = messages;
    }

    addMessage(userID, message){
        this.messages.push({
            datetime: new Date(),
            userID: userID,
            message: message
        })
    }
}

module.exports = {Channel}