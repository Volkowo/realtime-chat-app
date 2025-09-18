const {MongoClient} = require('mongodb');
const {addUsers} = require('./addUsers');
const {addChannels} = require('./addChannel');
const {addMessages} = require('./addMessages');
const {addJoinRequest} = require('./addJoinRequest')
const {addGroups} = require('./addGroups');
const {addMembership} = require('./addMembership');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = "assignmentSF";
async function main(){
    await client.connect();
    console.log("connexted to server")
    const db = client.db(dbName);
    const userCollection = db.collection('users');
    const messageCollection = db.collection('message');
    const membershipCollection = db.collection('membership');
    const requestCollection = db.collection('request');
    const groupCollection = db.collection('group');
    const channelCollection = db.collection('channel');

    await addUsers(userCollection);
    await addMessages(messageCollection);
    await addMembership(membershipCollection);
    await addJoinRequest(requestCollection);
    await addGroups(groupCollection);
    await addChannels(channelCollection);

    return 'done..?';
}

main()
    .then(console.log("main"))
    .catch(console.error)
    .finally(() => client.close());