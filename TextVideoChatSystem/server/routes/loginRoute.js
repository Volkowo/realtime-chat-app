const { readJSON, writeJSON } = require('../models/jsonHelper');
const { ChatUser } = require("../models/ChatUsers");

function route(app, userCollection) {
    // ROUTE
    app.post('/api/auth', async function (req, res) {
        if (!req.body) {
            return res.sendStatus(400);
        }

        const { username, pass } = req.body;

        const loggedUser = await userCollection.findOne({ username, pass });
        console.log(loggedUser);
        console.log(req.body);
        console.log("AAAAAA " + username, pass);

        if (loggedUser) {
            const { pass, ...loggedUserWithoutPass } = loggedUser;
            loggedUserWithoutPass.signedIn = true;

            res.json(loggedUserWithoutPass);
        } else {
            res.json({ signedIn: false });
        }
    });

    // register a new user
    app.post('/api/register', async function(req, res){
        if (!req.body) {
            return res.sendStatus(400);
        }

        const { username, password, email } = req.body;

        // Making the ID for new user
        var userID = createID();

        const user = await userCollection.findOne( {username: username.toLowerCase() });
        console.log(user);

        if(user){
            res.json({register: false})
        } else {
            await userCollection.insertOne({
                id: userID,
                email: email,
                username: username,
                pass: password,
                roles: ["chatUser"],
                signedIn: false
            })
            res.json({register: true})
        }
    })
}

function createID(){
    var date = new Date().toString()
    var date_split = date.split(" ")
    var dateForID = date_split[4].split(":").join("");
    var newUserID = `${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

    return newUserID
}
module.exports = { route };