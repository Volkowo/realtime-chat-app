const { readJSON, writeJSON } = require('../models/jsonHelper');

function route(app, path) {
    // ROUTE
    app.put('/api/user/:userID/group/:groupID/role', function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        const users = readJSON('../data/users.json');

        const userID = req.params.userID;
        const groupID = req.params.groupID;

        const user = users.find(user => user.id == userID)
        console.log(user)
        const group = user.groups.find(group => group.group == groupID);
        console.log(group)

        group.role = "groupAdmin"

        if(!user.roles.includes("groupAdmin")){
            user.roles.push("groupAdmin")
        }

        writeJSON('../data/users.json', users)

        res.json(user)
    });

    //2. Get users
    app.get('/api/users', function (req, res){
        const users = readJSON('../data/users.json');
        res.json(users)
    })
}
module.exports = { route };