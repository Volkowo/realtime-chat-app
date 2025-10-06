const { readJSON, writeJSON } = require('../models/jsonHelper');

function route(app, channelCollection, messageCollection) {
    // ROUTE
    // 1. Get the list of channel
    app.get('/api/groups/:groupID/channels', async function (req, res) {
        const groupID = req.params.groupID;

        console.log("groupID (backend): ", groupID)

        const channels = await channelCollection.find({groupID: groupID}).toArray();
        console.log("Channel (Backend): ", channels);

        if(channels){
            res.json(channels)
        } else {
            console.log("no channels..?")
        }
    })

    // 2. Get the list of messages of a channel
    app.get('/api/groups/:groupID/channels/:channelID', async function (req, res) {
        const groupID = req.params.groupID;
        const channelID = req.params.channelID;

        const messages = await messageCollection.find({groupID: groupID, channelID: channelID}).toArray();

        console.log(messages);
        
        if (messages){
            console.log("messages (backend): ", messages)
            res.json(messages)
        } else {
            console.log("idk you suck grr")
        }
    });
}

module.exports = { route };