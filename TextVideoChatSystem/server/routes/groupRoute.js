const { readJSON, writeJSON } = require('../models/jsonHelper');

function route(app, path) {
    // ROUTE
    app.get('/api/groups/:userID', function(req, res) {
        const userID = req.params.userID;
        const groups = readJSON('../data/groups.json')
        console.log("userID (backend): ", userID)
        if (!userID) {
            return res.sendStatus(400);
        }

        const userGroup = groups.filter(group => group.users.includes(userID));
        if(userGroup){
            console.log("GROUPS (backend):", userGroup);
            res.json(userGroup)
        } else{
            console.log("no grpups..?")
        }
    })
}
module.exports = { route };