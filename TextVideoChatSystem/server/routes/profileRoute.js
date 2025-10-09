const { readJSON, writeJSON } = require('../models/jsonHelper');
const { Group } = require("../models/Groups");
const { Channel } = require("../models/Channel");
const { Banned } = require("../models/Banned");
const { JoinRequest } = require("../models/JoinRequest");
const path = require('path');

const multer = require('multer');

const pfpStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images/pfp'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: pfpStorage })

function route(app, userCollection, membershipCollection, groupCollection, requestCollection, channelCollection) {
    // ROUTE
    // promote to group admin
    app.put('/api/user/:userID/group/:groupID/role', async function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        const userID = req.params.userID;
        const groupID = req.params.groupID;
        const newRole = req.body.role;

        const user = await userCollection.findOne({id: userID})
        console.log("USER: ", user)

        // update membership
        await membershipCollection.updateOne(
            {userID: userID, groupID: groupID},
            { $set: {
                role: "superAdmin"
            }
            }
        )

        if(!user.roles.includes(newRole)){
            await userCollection.updateOne(
                {id: userID},
                {$push: {
                    roles: newRole
                }}
            )
        }

        const updatedUsers = await userCollection.find({}).toArray();
        const updatedMembership = await membershipCollection.find({}).toArray();

        res.json({updatedUsers, updatedMembership})
    });

    // Promote to super admin
    app.put('/api/user/:userID/superAdminPromotion', async function (req, res){
        if (!req.body) {
            return res.sendStatus(400);
        }

        const userID = req.params.userID;
        // find user in Mongo
        const user = await userCollection.findOne({id: userID})

        // get groupID from groupCollection
        const groups = await groupCollection.find({}).toArray();
        const groupID = groups.map(group => group.groupID);

        // Making the ID for request
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        
        // Adding groupID + userID to Membership
        for (const group of groupID){
            var membershipID = `m${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`
            await membershipCollection.updateOne(
                {userID: userID, groupID: group},
                {
                    $set: {role: "superAdmin"},
                    $setOnInsert: {membershipID: membershipID}
                },
                // upsert means insert to collection if the userID+groupID doesn't exist in the collection (I think).
                {upsert: true}
            )
        }

        // add to roles in users.json
        if(!user.roles.includes('superAdmin')){
            await userCollection.updateOne(
                {id: userID},
                {$push: {
                    roles: "superAdmin"
                }}
            )
        }

        // errr get updated user and membership..?
        const updatedUser = await userCollection.find({}).toArray();
        const updatedMembership = await membershipCollection.find({}).toArray();

        res.json({updatedUser, updatedMembership})
    })

    // Add user to group
    app.put('/api/group/:groupID/add/:userID', async function (req, res){
        const userID = req.params.userID;
        const groupID = req.params.groupID;

        // find user in Mongo
        const user = await userCollection.find({id: userID});

        // add group to membership
        // Making the ID for new membership
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var newMembershipID = `m${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`
        await membershipCollection.insertOne(
            {
                membershipID: newMembershipID,
                userID: userID,
                groupID: groupID,
                role: "chatUser"
            }
        )

        // removing request from user to join said group
        await requestCollection.deleteMany(
            {userID: userID, groupID: groupID}
        );

        const updatedMembership = await membershipCollection.find({}).toArray();
        const updatedRequests = await requestCollection.find({}).toArray();

        res.json({updatedMembership, updatedRequests})
    })

    // add new channel to an existing group
    app.put('/api/group/:groupID/addChannel/:newChannel', async function(req, res){
        const groupID = req.params.groupID;
        const newChannel = req.params.newChannel;
        console.log(newChannel)


        // Making the ID for new channel
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var newChannelID = `c${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        // adding new channel to Mongo
        await channelCollection.insertOne({
            channelID: newChannelID,
            channelName: newChannel,
            groupID: groupID
        })

        // get updated channel
        const updatedChannel = await channelCollection.find({}).toArray();
        res.json(updatedChannel)
    })

    // add a new group
    app.post('/api/group/newGroup/:userID/:newGroup/:newGroup_channel', async function(req, res){
        const userID = req.params.userID;
        const newGroup = req.params.newGroup;
        const newGroup_channel = req.params.newGroup_channel;

        // Making the ID for new group
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var newGroupID = `g${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        // find the user
        const user = await userCollection.findOne({ id: userID });

        // Making the ID for new channel
        var newChannelID = `c${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        // making ID for membership
        var newMembershipID = `m${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        // Make channel
        const channel = await channelCollection.insertOne({
            channelID: newChannelID,
            channelName: newGroup_channel,
            groupID: newGroupID
        })

        // Make group (with this channel inside channels array)
        const group = await groupCollection.insertOne({
            groupID: newGroupID,
            groupName: newGroup,
            bannedUsers: []
        })

        // add the current user to membership
        await membershipCollection.insertOne({
            membershipID: newMembershipID,
            userID: userID,
            groupID: newGroupID,
            role: "groupAdmin"
        })

        
        // Get super admin from collection
        const superAdmin = await userCollection.find({
            roles: "superAdmin"
        }).toArray();
        
        // add them to the membership too
        /*
            I'm using updateOne instead of insertOne because:
                1. If the current user that creates the group is a superAdmin, then we can update their role with $set
                2. upsert: true -> means we're creating a new membership if userID + groupID combo doesn't exist.
                3. $setOnInsert works together with upsert: true because we're adding newMembershipID *only* when creating a new membership.
            idk if there's any other better way to do this so uhh yeah
        */
        for(const admin of superAdmin){
            newMembershipID = `m${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`
            await membershipCollection.updateOne(
            {
                userID: admin.id,
                groupID: newGroupID,
            },
            {
                $set: {role: "superAdmin"},
                $setOnInsert: {membershipID: newMembershipID}
            },
            {upsert: true}
        )
        }

        // update user's role if they don't have groupAdmin already
        if (!user.roles.includes("superAdmin") && !user.roles.includes("groupAdmin")) {
            await userCollection.updateOne(
                {id: userID},
                {$push: {
                    roles: "groupAdmin"
                }}
            )
        }

        const updatedUsers = await userCollection.find({}).toArray();
        const updatedMembership = await membershipCollection.find({}).toArray();
        const updatedGroup = await groupCollection.find({}).toArray();
        const updatedChannel = await channelCollection.find({}).toArray();
        
        res.json({updatedUsers, updatedMembership, updatedGroup, updatedChannel})
    })

    // Delete Group
    app.delete('/api/group/:groupID/remove', async function(req, res){
        const groupID = req.params.groupID;

        // removing said group from the collection
        await groupCollection.deleteOne({groupID: groupID});

        // remove any membership for that group too
        await membershipCollection.deleteMany({groupID: groupID});

        // remove any channel relateed to said group.
        await channelCollection.deleteMany({groupID: groupID})

        // returns every group and membership..? MIGHT HAVE TO INCLUDE USER ID TOO?  
        const updatedChannel = await channelCollection.find({}).toArray();      
        const updatedGroup = await groupCollection.find({}).toArray();
        const updatedMembership = await membershipCollection.find({}).toArray();

        console.log("UPDATED GROUP: ", updatedGroup);

        res.json({updatedGroup, updatedMembership, updatedChannel})
    })

    // Delete Channel
    app.delete('/api/group/:groupID/channel/:channelID/remove', async function(req, res){
        const groupID = req.params.groupID;
        const channelID = req.params.channelID;

        // remove channel from collection
        await channelCollection.deleteOne({
            groupID: groupID, channelID: channelID
        })

        const updatedChannel = await channelCollection.find({}).toArray();

        res.json(updatedChannel);
    })

    // KICK user
    app.delete('/api/group/:groupID/user/:userID/kick', async function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        
        // remove user from membership
        await membershipCollection.deleteOne({userID: userID, groupID: groupID});

        const updatedMembership = await membershipCollection.find({}).toArray();
        
        res.json(updatedMembership)
    })

    // BAN user
    app.post('/api/group/:groupID/user/:userID/ban', async function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        const banReason = req.body.kickBanReason;

        // remove user from membership
        await membershipCollection.deleteOne({userID: userID, groupID: groupID});

        // add user to bannedUsers
        const bannedUser = {userID: userID, reason: banReason};
        await groupCollection.updateOne(
            {groupID: groupID},
            // its push but prevents any duplicates..?
            {$addToSet: {
                bannedUsers: bannedUser
            }}
        )
        
        // get updated group + membership
        const updatedGroup = await groupCollection.find({}).toArray();
        const updatedMembership = await membershipCollection.find({}).toArray();
        

        // console.log("BANNED USER(S): ", bannedGroup);
        
        res.json({updatedGroup, updatedMembership})
    })

    // request to join
    app.post('/api/request/join/:groupID/:userID', async function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        var reasonToJoin = req.body.reasonToJoin;

        // Making the ID for request
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var requestID = `r${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        if(reasonToJoin == ""){
            reasonToJoin = "No reason was given"
        } 

        await requestCollection.insertOne({
            requestID: requestID,
            userID: userID,
            groupID: groupID,
            reasonToJoin: reasonToJoin,
            dateTime: date
        })

        const updatedRequests = await requestCollection.find({}).toArray();

        res.json(updatedRequests)
    })

    // Approve/reject request
    app.put('/api/request/join/:groupID/:userID/:requestID/:action', async function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;
        const requestID = req.params.requestID;
        const action = req.params.action;

        // Making the ID for request
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var membershipID = `m${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        if(action == "approve"){
            // Add group to user if not already there
            await membershipCollection.updateOne(
                {groupID: groupID, userID: userID},
                {$setOnInsert: {
                    membershipID: membershipID,
                    role: "chatUser"
                }},
                {upsert: true}
            )
        }
        // removes all requests from this user for this group no matter what
        await requestCollection.deleteMany({userID: userID, groupID: groupID});

        const updatedMembership = await membershipCollection.find({}).toArray();
        const updatedRequest = await requestCollection.find({}).toArray();

        res.json({updatedMembership, updatedRequest})
    })

    // delete user
    app.delete('/api/user/:userID/delete', async (req, res) => {
        const userID = req.params.userID;

        // remove user from user + request + membership collection
        await userCollection.deleteOne({id: userID});
        await requestCollection.deleteMany({userID: userID})
        await membershipCollection.deleteMany({userID: userID});

        const updatedUsers = await userCollection.find({}).toArray();
        const updatedRequests = await requestCollection.find({}).toArray();
        const updatedMemberships = await membershipCollection.find({}).toArray();

        res.json({updatedUsers, updatedRequests, updatedMemberships});
    });

    // update profile picture
    app.post('/api/update/:userID', upload.single('profileImage'), async function (req, res, next) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        const userID = req.params.userID;
        const profilePicture = req.file;

        console.log(`userID: ${userID}`);
        console.log("profile picture:", profilePicture)

        var imageURL = `images/pfp/${profilePicture.filename}`

        await userCollection.updateOne(
            {id: userID},
            {$set: {
                avatar: imageURL
            }}
        )

        const updatedUser = await userCollection.findOne(
            { id: userID },
            { projection: { password: 0 } }   // 0 to exclude the password from being copied
        );

        res.json(updatedUser);
    })

    // get groups that user isn't in
    app.get('/api/groupsNotIn/:userID', async function (req, res){
        // get the groupID the user is in
        const userID = req.params.userID;
        const groupsUserIsIn = await membershipCollection.find({userID: userID}).project({groupID: 1}).toArray();
        const groupIDsIn = groupsUserIsIn.map(g => g.groupID);

        // get groups the user is NOT in
        // We're using nin since we're comparing groupID with the array groupIDsIn
        const groupsNotIn = await groupCollection.find({ groupID: { $nin: groupIDsIn } }).toArray();
        
        console.log("BACKEND - GROUPS USER IS NOT IN: ", groupsNotIn);
        res.json(groupsNotIn);
    })
    
    // Get USER's membership
    app.get('/api/groupsIn/:userID', async function (req, res){
        const userID = req.params.userID;
        console.log("USER ID:", userID)

        // get the groupID the user is in
        const groupsUserIsIn = await membershipCollection.find({userID: userID}).toArray();

        console.log("GROUP DETAILS: ", groupsUserIsIn);

        if(groupsUserIsIn){
            res.json(groupsUserIsIn)
        } else{
            console.log("no grpups..?")
        }
    })

    // Get users
    app.get('/api/users', async function (req, res){
        const users = await userCollection.find({}).toArray();
        res.json(users)
    })

    // Get groups
    app.get('/api/groups', async function(req, res){
        const groups = await groupCollection.find({}).toArray();
        res.json(groups)
    })

    // get request
    app.get('/api/requests', async function(req, res){
        const requests = await requestCollection.find({}).toArray();
        res.json(requests)
    })

    // get channel
    app.get('/api/channels', async function(req, res){
        const channels = await channelCollection.find({}).toArray();
        res.json(channels)
    })

    // get membership
    app.get('/api/membership', async function(req, res){
        const membership = await membershipCollection.find({}).toArray();
        res.json(membership)
    })

}
module.exports = { route };