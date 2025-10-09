const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const sockets = require('./socket');

// Create app
const app = express();
app.use('/images', express.static('images'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "http://localhost:4200", methods: ["GET", "POST"] }
});

// Routes
const loginRoute = require('./routes/loginRoute');
const groupRoute = require('./routes/groupRoute');
const channelRoute = require('./routes/channelRoute');
const profileRoute = require('./routes/profileRoute');

const dbName = "assignmentSF";
const client = new MongoClient('mongodb://localhost:27017');

// This is for testing (like actual testing)
let db, userCollection, messageCollection, membershipCollection, requestCollection, groupCollection, channelCollection;


async function initApp(testing = false) {
    await client.connect();
    db = client.db(dbName);

    // Collections
    userCollection = db.collection('users');
    messageCollection = db.collection('message');
    membershipCollection = db.collection('membership');
    requestCollection = db.collection('request');
    groupCollection = db.collection('group');
    channelCollection = db.collection('channel');

    // Register routes
    loginRoute.route(app, userCollection);
    groupRoute.route(app, membershipCollection, groupCollection, messageCollection, io);
    channelRoute.route(app, channelCollection, messageCollection);
    profileRoute.route(app, userCollection, membershipCollection, groupCollection, requestCollection, channelCollection);

    // Socket 
    if(testing == false){
        sockets.connect(io, 3000, userCollection);
    }

    return {
        db,
        userCollection,
        messageCollection,
        membershipCollection,
        requestCollection,
        groupCollection,
        channelCollection
    };
}

// Only start server when not in test mode
if (require.main === module) {
    initApp().then(() => {
        const PORT = 3000;
        server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = { 
    app,
    initApp,
    server, 
    client, 
    getCollections: () => ({
        db,
        userCollection,
        messageCollection,
        membershipCollection,
        requestCollection,
        groupCollection,
        channelCollection
    })};

