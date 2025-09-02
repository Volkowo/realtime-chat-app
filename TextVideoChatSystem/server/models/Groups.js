const { Channel } = require("./Channel");

class Group{
    constructor(groupID, groupName, channels = [], users = []){
        this.groupID = groupID;
        this.groupName = groupName;
        this.channels = channels;
        this.users = users;
    }
}

const group1Channels = [
    new Channel("c1", "general"),
    new Channel("c2", "random")
];
group1Channels[0].addMessage("m1", "1", "Welcome to TestGroup!");
group1Channels[0].addMessage("m2", "2", "Hi everyone!");
group1Channels[1].addMessage("m3", "4", "Random thoughts here...");

const group2Channels = [
    new Channel("c3", "general"),
    new Channel("c4", "memes")
];
group2Channels[0].addMessage("m4", "2", "Hello FunGroup!");
group2Channels[0].addMessage("m5", "3", "Hi userTwo!");
group2Channels[1].addMessage("m6", "3", "Check out this meme!");

const group3Channels = [
    new Channel("c5", "projects")
];
group3Channels[0].addMessage("m6", "5", "Working on project phase 1");

const groups = [
    new Group("1", "TestGroup", group1Channels, ["1", "2", "4"]),
    new Group("2", "FunGroup", group2Channels, ["1", "2", "3"]),
    new Group("3", "ProjectGroup", group3Channels, ["1", "5"])
];

const groupsMap = {
    "1": groups[0],
    "2": groups[1],
    "3": groups[2]
}

module.exports = {Group, groups, groupsMap}