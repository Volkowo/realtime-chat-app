class Group{
    constructor(id, groupName, channels = [], users = []){
        this.id = id;
        this.groupName = groupName;
        this.channels = channels;
        this.users = users;
    }
}

const groups = [
    new Group("1", "testGroup", ["Channel 1", "Channel 2", "Test Channel"], ["1"])
]

module.exports = {Group, groups}