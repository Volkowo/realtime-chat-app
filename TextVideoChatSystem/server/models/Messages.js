class Message{
    constructor(messageID, userID, message, date){
        this.messageID = messageID;
        this.userID = userID
        this.message = message;
        this.datetime = new Date();
    }
}

module.exports = { Message };