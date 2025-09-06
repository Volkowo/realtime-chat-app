const { readJSON, writeJSON } = require('../models/jsonHelper');
const { Group } = require("../models/Groups");
const { Channel } = require("../models/Channel");
const { Banned } = require("../models/Banned");
const { JoinRequest } = require("../models/JoinRequest");

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
        let requests = readJSON('../data/joinRequest.json');
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

        requests = requests.filter(r => !(r.userID === userID && r.groupID === groupID));

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);
        writeJSON('../data/joinRequest.json', requests);

        res.json({user, group, requests})
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

        
        // Add superAdmin to the thing as well
        const superAdmin = users.filter(user => user.roles.includes("superAdmin"))
        
        superAdmin.forEach(admin => {
            if (!admin.groups.some(g => g.group === newGroupID)) {
                admin.groups.push({ group: newGroupID, role: "superAdmin" });
            }

            if(!group.users.includes(admin.id)){
                group.users.push(admin.id)
            }
        })

        // find user in users.json
        const user = users.find(user => user.id == userID)
        if (!user.roles.includes("superAdmin")) {
            // Only give groupAdmin role if the creator is not already a superAdmin
            user.groups.push({ group: newGroupID, role: "groupAdmin" });
        }
        // const groupID = req.params.groupID;

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);
        
        res.json({user, group})
    })

    // Delete Group
    app.delete('/api/group/:groupID/remove', function(req, res){
        let groups = readJSON('../data/groups.json');
        let users = readJSON('../data/users.json');
        const groupID = req.params.groupID;

        groups = groups.filter(group => group.groupID !== groupID)
        users.forEach(user => {
            user.groups = user.groups.filter(group => group.group !== groupID)
        })

        writeJSON('../data/groups.json', groups);
        writeJSON('../data/users.json', users);

        res.json({users, groups})
    })

    // Delete Channel
    app.delete('/api/group/:groupID/channel/:channelID/remove', function(req, res){
        let groups = readJSON('../data/groups.json');
        const groupID = req.params.groupID;
        const channelID = req.params.channelID;

        let group = groups.find(group => group.groupID == groupID);
        group.channels = group.channels.filter(channel => 
            channel.channelID != channelID
        )


        writeJSON('../data/groups.json', groups);

        res.json(group)
    })

    // KICK user
    app.delete('/api/group/:groupID/user/:userID/kick', function(req, res){
        let users = readJSON('../data/users.json')
        let groups = readJSON('../data/groups.json');
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        
        let group = groups.find(group => group.groupID == groupID);
        let user = users.find(user => user.id == userID);
        if (!group || !user) {
            return res.status(404).json({ error: 'Group or user not found' });
        }

        group.users = group.users.filter(user => 
            user !== userID
        )

        user.groups = user.groups.filter(group =>
            group.group !== groupID
        )

        
        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);
        
        res.json({users, groups})
    })

    // BAN user
    app.post('/api/group/:groupID/user/:userID/ban', function(req, res){
        let users = readJSON('../data/users.json')
        let groups = readJSON('../data/groups.json');
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        const banReason = req.body.kickBanReason;
        
        let group = groups.find(group => group.groupID == groupID);
        let user = users.find(user => user.id == userID);
        if (!group || !user) {
            return res.status(404).json({ error: 'Group or user not found' });
        }

        // Remove user from group
        group.users = group.users.filter(user => 
            user !== userID
        )

        // remove group from user
        user.groups = user.groups.filter(group =>
            group.group !== groupID
        )

        const ban = new Banned(userID, banReason)

        if(!group.bannedUsers.some(ban => ban.userID === userID)){
            group.bannedUsers.push(ban)
        }

        
        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);

        console.log("BANNED USER(S): ", group.bannedUsers);
        
        res.json({users, groups})
    })

    // request to join
    app.post('/api/request/join/:groupID/:userID', function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        const reasonToJoin = req.body.reasonToJoin;
        let requests = readJSON('../data/joinRequest.json');

        // Making the ID for request
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var requestID = `r${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        const request = new JoinRequest(requestID, userID, groupID, reasonToJoin);
        requests.push(request)

        writeJSON('../data/joinRequest.json', requests)
        res.json(requests)
    })

    // Approve/reject request
    app.put('/api/request/join/:groupID/:userID/:requestID/:action', function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        const requestID = req.params.requestID;
        const action = req.params.action;
        let users = readJSON('../data/users.json')
        let groups = readJSON('../data/groups.json');
        let requests = readJSON('../data/joinRequest.json');

        let group = groups.find(group => group.groupID == groupID);
        let user = users.find(user => user.id == userID);
        let request = requests.find(request => request.requestID == requestID)

        if (!group || !user || !request) {
            return res.status(404).json({ error: "Group, user, or request not found" });
        }

        if(action == "approve"){
            // Add group to user if not already there
            if (!user.groups.some(g => g.group === groupID)) {
                user.groups.push({
                    group: groupID,
                    role: "chatUser" 
                });
            }

            // Add user to group if not already there
            if (!group.users.includes(userID)) {
                group.users.push(userID);
            }
        }
        // removes all requests from this user for this group no matter what
        requests = requests.filter(r => !(r.userID === userID && r.groupID === groupID));

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);
        writeJSON('../data/joinRequest.json', requests);

        res.json({users, groups, requests})
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

    // get request
    app.get('/api/requests', function(req, res){
        const requests = readJSON('../data/joinRequest.json');
        res.json(requests)
    })
}
module.exports = { route };