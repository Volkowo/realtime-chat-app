const { ObjectId, MongoClient } = require('mongodb');
const dbName = "assignmentSF";
const client = new MongoClient('mongodb://localhost:27017');

var express = require('express'); //used for routing
var app = express();

var path = require('path');
var cors = require('cors');
app.use(cors());
var http = require('http').Server(app); //used to provide http functionality
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const loginRoute = require('./routes/loginRoute');
const groupRoute = require('./routes/groupRoute');
const channelRoute = require('./routes/channelRoute');
const profileRoute = require('./routes/profileRoute')

async function main(){
    await client.connect();
    const db = client.db(dbName)

    // collection(s)
    const userCollection = db.collection('users');
    const messageCollection = db.collection('message');
    const membershipCollection = db.collection('membership');
    const requestCollection = db.collection('request');
    const groupCollection = db.collection('group');
    const channelCollection = db.collection('channel');

    // console.log(userCollection)

    // routes
    loginRoute.route(app, userCollection); 
    groupRoute.route(app, membershipCollection, groupCollection);
    channelRoute.route(app, channelCollection, messageCollection);
    profileRoute.route(app, userCollection, membershipCollection, groupCollection, requestCollection, channelCollection);

    // listen
    let server = http.listen(3000, function() {
        let host = server.address().address;
        let port = server.address().port;
        console.log("Server is running (i think).");
        console.log(`Server listening on: ${host} || port: ${port}`);
    })
}

main();

