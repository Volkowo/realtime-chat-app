const { Channel } = require("./Channel");

class Group{
    constructor(groupID, groupName, channels = [], users = [], bannedUsers = []){
        this.groupID = groupID;
        this.groupName = groupName;
        this.channels = channels;
        this.users = users;
        this.bannedUsers = bannedUsers;
    }
}

module.exports = {Group}