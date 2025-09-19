const { readJSON, writeJSON } = require('../models/jsonHelper');

function route(app, membershipCollection, groupCollection) {
    // ROUTE

    // get user's group list
    app.get('/api/groups/:userID', async function(req, res) {
        const userID = req.params.userID;
        console.log("userID (backend): ", userID)
        if (!userID) {
            return res.sendStatus(400);
        }

        const groupsUserIn = await membershipCollection.find({userID: userID}).toArray()
        const groupIDs = groupsUserIn.map(group => group.groupID);
        console.log("BACKEND LIST OF GROUP ID: ", groupIDs);

        const groupDetails = await groupCollection.find({
            groupID : {$in: groupIDs}
        }).toArray();

        console.log("GROUP DETAILS: ", groupDetails);

        if(groupDetails){
            res.json(groupDetails)
        } else{
            console.log("no grpups..?")
        }
    })

    // Leave Group
    app.delete('/api/group/:groupID/:userID/leave', async function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;

        const membership = await membershipCollection.deleteOne({groupID: groupID, userID: userID})

        const groupsUserIn = await membershipCollection.find({userID: userID}).toArray()
        const groupIDs = groupsUserIn.map(group => group.groupID);
        console.log("BACKEND LIST OF GROUP ID: ", groupIDs);

        const groupDetails = await groupCollection.find({
            groupID : {$in: groupIDs}
        }).toArray();

        
        res.json(groupDetails)
    })
}

module.exports = { route };