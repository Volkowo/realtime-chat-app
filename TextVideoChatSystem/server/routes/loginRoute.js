const { readJSON } = require('../models/jsonHelper');

function route(app, path) {
    // ROUTE
    app.post('/api/auth', function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        const { username, pass } = req.body;
        const users = readJSON('../data/users.json')
        console.log(users);
        console.log(req.body);
        console.log("AAAAAA " + username, pass);
        const loggedUser = users.find(user => user.username === username && user.pass === pass);

        if (loggedUser) {
            const { pass, ...loggedUserWithoutPass } = loggedUser;
            loggedUserWithoutPass.signedIn = true;

            res.json(loggedUserWithoutPass);
        } else {
            res.json({ signedIn: false });
        }
    });
}
module.exports = { route };