const { readJSON, writeJSON } = require('../models/jsonHelper');

function route(app, path) {
    // ROUTE
    const groups = readJSON('../data/groups.json')
    // 1. Get the list of channel
    app.get('/api/groups/:groupID/channels', function (req, res) {
    const groupID = req.params.groupID;

    console.log("groupID (backend): ", groupID)

    const group = groups.find(group => group.groupID == groupID);
    if(group){
        const channels = group.channels
        console.log("CHANNELS (BACKEND): ", channels)
        res.json(channels)
    } else {
        console.log("no channels..?")
    }
    })

    // 2. Get the list of messages of a channel
    app.get('/api/groups/:groupID/channels/:channelID', function (req, res) {
        const groupID = req.params.groupID;
        const channelID = req.params.channelID;

        console.log("groupID (backend): ", groupID)
        console.log("channelID (backend): ", channelID)

        if(!channelID && !groupID){
            return res.sendStatus(400);
        }

        const group = groups.find(group => group.groupID == groupID);
        const channel = group.channels.find(channel => channel.channelID == channelID)
        
        if (channel){
            console.log("messages (backend): ", channel.messages)
            res.json(channel.messages)
        } else {
            console.log("idk you suck grr")
        }
    });
}

module.exports = { route };