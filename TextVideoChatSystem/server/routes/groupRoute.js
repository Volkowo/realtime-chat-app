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

    // Leave Group
    app.delete('/api/group/:groupID/:userID/leave', function(req, res){
        let users = readJSON('../data/users.json')
        let groups = readJSON('../data/groups.json');
        const groupID = req.params.groupID;
        const userID = req.params.userID;

        let group = groups.find(group => group.groupID == groupID);
        let user = users.find(user => user.id == userID);

        group.users = group.users.filter(user => 
            user !== userID
        )

        user.groups = user.groups.filter(group =>
            group.group !== groupID
        )

        writeJSON('../data/users.json', users);
        writeJSON('../data/groups.json', groups);
        
        res.json({user, groups})
    })
}
module.exports = { route };