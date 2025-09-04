const { Channel } = require("./Channel");

class Group{
    constructor(groupID, groupName, channels = [], users = []){
        this.groupID = groupID;
        this.groupName = groupName;
        this.channels = channels;
        this.users = users;
    }
}

module.exports = {Group}