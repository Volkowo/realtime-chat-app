const { users } = require('../models/ChatUsers');

function route(app, path) {
    // ROUTE
    app.post('/api/auth', function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        const { email, pass } = req.body;
        console.log(users);
        console.log(req.body);
        console.log("AAAAAA " + email, pass);
        const loggedUser = users.find(user => user.email === email && user.pass === pass);

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