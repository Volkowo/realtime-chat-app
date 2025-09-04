const { readJSON, writeJSON } = require('../models/jsonHelper');
const { Group } = require("../models/Groups");
const { Channel } = require("../models/Channel");

function route(app, path) {
    // ROUTE
    // promote to group admin
    app.put('/api/user/:userID/group/:groupID/role', function (req, res) {
        const users = readJSON('../data/users.json');
        const groups = readJSON('../data/groups.json');
        if (!req.body) {
            return res.sendStatus(400);
        }

        const userID = req.params.userID;
        const groupID = req.params.groupID;
        const newRole = req.body.role;

        const user = users.find(user => user.id == userID)
        console.log(user)
        const group = user.groups.find(group => group.group == groupID);
        console.log(group)

        group.role = newRole

        if(!user.roles.includes(newRole)){
            user.roles.push(newRole)
        }

        writeJSON('../data/users.json', users)

        res.json(user)
    });

    // Promote to super admin
    app.put('/api/user/:userID/superAdminPromotion', function (req, res){
        const users = readJSON('../data/users.json');
        const groups = readJSON('../data/groups.json');
        if (!req.body) {
            return res.sendStatus(400);
        }

        const userID = req.params.userID;
        // find user in users.json
        const user = users.find(user => user.id == userID)

        // pushing groupID into an array
        idOfGroups = [];
        for (let i = 0; i < groups.length; i++) {
            idOfGroups.push(groups[i].groupID)
        }

        // adding user to users in groups.json
        for (let i = 0; i < groups.length; i++) {
            // adding user if he's not in the group
            if(!groups[i].users.includes(userID)){
                groups[i].users.push(userID)
            }
        }

        // adding group to users.json
        // empty the groups[] -> re-add it? no nevermind I can just use map
        user.groups = groups.map(group => ({group: group.groupID, role: "superAdmin"}))

        // add to roles in users.json
        if(!user.roles.includes('superAdmin')){
            user.roles.push('superAdmin')
        }

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);

        res.json(user)
    })

    // Add user to channel
    app.put('/api/group/:groupID/add/:userID', function (req, res){
        const users = readJSON('../data/users.json');
        const groups = readJSON('../data/groups.json');
        const userID = req.params.userID;
        const groupID = req.params.groupID;

        // find user in users.json
        const user = users.find(user => user.id == userID)
        // console.log(user.groups)

        // add group to user.groups
        user.groups.push({
            group: groupID,
            role: "chatUser" 
        })

        // add userID to groups
        // getting group in groups.json
        const group = groups.find(group => group.groupID == groupID);
        group.users.push(userID)

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);

        res.json({user, group})
    })

    // add new channel to an existing group
    app.put('/api/group/:groupID/addChannel/:newChannel', function(req, res){
        const groups = readJSON('../data/groups.json');
        const groupID = req.params.groupID;
        const newChannel = req.params.newChannel;
        console.log(newChannel)

        const group = groups.find(group => group.groupID == groupID);
        console.log(group.channels)

        // Making the ID for new channel
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var newChannelID = `c${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        group.channels.push({channelID: newChannelID, channelName: newChannel, messages: []})

        writeJSON('../data/groups.json', groups);
        res.json(group)
    })

    // add a new group
    app.post('/api/group/newGroup/:userID/:newGroup/:newGroup_channel', function(req, res){
        const userID = req.params.userID;
        const newGroup = req.params.newGroup;
        const newGroup_channel = req.params.newGroup_channel;
        const groups = readJSON('../data/groups.json');
        const users = readJSON('../data/users.json');

        // Making the ID for new group
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var newGroupID = `g${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        // Making the ID for new channel
        var newChannelID = `c${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        // Make channel
        const channel = new Channel(newChannelID, newGroup_channel);

        // Make group (with this channel inside channels array)
        const group = new Group(newGroupID, newGroup, [channel], [userID]);
        groups.push(group)

        // find user in users.json
        const user = users.find(user => user.id == userID)
        user.groups.push({group: newGroupID, role: "groupAdmin"})

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);
        
        res.json({user, group})
    })

    // Get users
    app.get('/api/users', function (req, res){
        const users = readJSON('../data/users.json');
        res.json(users)
    })

    // Get groups
    app.get('/api/groups', function(req, res){
        const groups = readJSON('../data/groups.json');
        res.json(groups)
    })
}
module.exports = { route };