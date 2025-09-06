const { readJSON, writeJSON } = require('../models/jsonHelper');
const { ChatUser } = require("../models/ChatUsers");

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

    // register a new user
    app.post('/api/register', function(req, res){
        if (!req.body) {
            return res.sendStatus(400);
        }

        let users = readJSON('../data/users.json')

        const { username, password, email } = req.body;

        // Making the ID for new user
        var date = new Date().toString()
        var date_split = date.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var newUserID = `${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        if(users.find(user => user.username.toLowerCase() == username.toLowerCase() || user.email.toLowerCase() == email.toLowerCase())){
            res.json({register: false})
        } else {
            const newUser = new ChatUser(newUserID, email, username, password)
            users.push(newUser)

            writeJSON('../data/users.json', users)
            res.json({register: true})
        }
    })
}
module.exports = { route };