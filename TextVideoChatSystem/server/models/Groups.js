class Group{
    constructor(id, groupName){
        this.id = id;
        this.groupName = groupName;
        this.channels = [];
        this.users = [];
    }
}

const groups = [
    new Group("1", "testGroup", ["Channel 1", "Channel 2", "Test Channel"], ["1"])
]

module.exports = {Group, groups}