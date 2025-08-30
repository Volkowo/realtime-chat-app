const { groups } = require('../models/Groups');

function route(app, path) {
    // ROUTE
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
            console.log("Channel (one channel/backend): ", channel)
            res.json(channel)
        } else {
            console.log("idk you suck grr")
        }
    });
}

module.exports = { route };