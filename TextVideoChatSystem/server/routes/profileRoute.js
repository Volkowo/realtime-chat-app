const { groups } = require('../models/Groups');
const { users } = require('../models/ChatUsers');

function route(app, path) {
    // ROUTE
    app.put('/api/user/:userID/group/:groupID/role', function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        const userID = req.params.userID;
        const groupID = req.params.groupID;

        const user = users.find(user => user.id == userID)
        const group = user.groups.find(group => group.groupID == groupID);

        group.role = "superAdmin"

        // const { username, pass } = req.body;
        // console.log(users);
        // console.log(req.body);
        // console.log("AAAAAA " + username, pass);
        // const loggedUser = users.find(user => user.username === username && user.pass === pass);

        // if (loggedUser) {
        //     const { pass, ...loggedUserWithoutPass } = loggedUser;
        //     loggedUserWithoutPass.signedIn = true;

        //     res.json(loggedUserWithoutPass);
        // } else {
        //     res.json({ signedIn: false });
        // }
    });
}
module.exports = { route };