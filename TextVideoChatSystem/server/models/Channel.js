const { Message } = require("./Messages");

class Channel{
    constructor(channelID, channelName, messages = []){
        this.channelID = channelID
        this.channelName = channelName;
        this.messages = messages;
    }

    addMessage(messageID, userID, message){
        this.messages.push(new Message(messageID, userID, message))
    }
}

module.exports = {Channel}