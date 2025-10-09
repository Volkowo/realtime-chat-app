const { app, initApp, client, getCollections } = require('../server');
const request = require('supertest'); 
const { expect } = require('chai');
const fs = require('fs');


describe('Auth Routes', function() {
    let userCollection;
    let newGroupID;

    before(async function() {
        await initApp(true); 
        ({ userCollection, membershipCollection, messageCollection, groupCollection, channelCollection} = getCollections());

        // add one user for testing
        await userCollection.insertOne({
            id: "TEST",
            email: "TEST",
            username: "TESTACCOUNT",
            pass: "123",
            avatar: "TEST",
            roles: ["chatUser"],
            signedIn: false
        })

        // add one dummy group
        await groupCollection.insertOne({
            groupID: "TEST",
            groupName: "TESTGROUP",
            bannedUsers: []
        })
    });

    after(async function() {
        // Removes stuff that was added during testing
        await userCollection.deleteOne({ username: "testDB" });
        await userCollection.deleteOne({ id: "TEST" });
        await groupCollection.deleteOne({groupID: "TEST"})
        await membershipCollection.insertOne({
            membershipID: "m22",
            userID: "3",
            groupID: "g2",
            role: "chatUser"
        })
        await messageCollection.deleteOne({
            message: "TEST_Hello World!"
        })
        await messageCollection.deleteOne({
            message: "TEST2_Hello World!"
        })
        await membershipCollection.deleteOne({
            userID: '3',
            groupID: 'g4'
        })
        await channelCollection.deleteOne({
            groupID: "g4",
            channelName: "Amogus"
        })
        await membershipCollection.deleteMany({
            groupID: newGroupID
        })

        // close the client or smth idk
        await client.close(); 
    });

    describe("1. Login Route", function() {
        it("Should log in successfully", async function() {
            const res = await request(app)  // use supertest to make request
                .post('/api/auth')
                .send({ username: "super", pass: '123' });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('signedIn', true);
        });
    
        it("Should not log in with wrong credentials", async function() {
            const res = await request(app) 
                .post('/api/auth')
                .send({ username: "bruh", pass: 'lololol' });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('signedIn', false);
        });

        it("Should return 400 if no input in login", async function() {
            const res = await request(app)
                .post('/api/auth')
                .send(null);
    
            expect(res.status).to.equal(400);
        })

        it("Should register user if username unique", async function() {
            const res = await request(app)
                .post('/api/register')
                .send({ username: "testDB", pass: '123', email: "balls@email.com" });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('register', true);
        })

        it("Should register user if username isnt unique (hopefully)", async function() {
            const res = await request(app)
                .post('/api/register')
                .send({ username: "userTwo", password: '123', email: "balls@email.com" });
    
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('register', false);
        })

        it("Should return 400 if no input in register", async function() {
            const res = await request(app)
                .post('/api/register')
                .send(null);
    
            expect(res.status).to.equal(400);
        })
    })
    
    describe("2. Channel Route", function() {
        it("Should get a list of channel", async function() {
            const res = await request(app)
                .get(`/api/groups/${'g2'}/channels`)

            console.log("LKJASDJKLADS: ", res.body)

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            res.body.forEach(channel => {
                expect(channel).to.include.keys('channelID', 'channelName', 'groupID');
            });
        })

        it("Should get a list of messages", async function() {
            const res = await request(app)
                .get(`/api/groups/${'g2'}/channels/${'c4'}`)

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            res.body.forEach(message => {
                expect(message).to.include.keys('messageID', 'userID', 'groupID', 'channelID', "message", "images", "datetime");
            });
        })
    })

    describe("3. Group Route", function() {
        it("Should return an array of group the user is in", async function(){
            const res = await request(app)
                .get(`/api/groups/${3}`)

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            res.body.forEach(group => {
                expect(group).to.include.keys('groupID', 'groupName', 'bannedUsers');
            })
        })

        it("Should remove a user from a group", async function(){
            const res = await request(app)
                .delete(`/api/group/${'g2'}/${'3'}/leave`)

            expect(res.status).to.equal(200);
            // expects the returned res to NOT have g2
            res.body.forEach(group => {
                expect(group.groupID).to.not.equal('g2');
            });
        })

        it("Should send a message with image", async function(){
            const res = await request(app)
                .post(`/api/addMessage/${'3'}/${'c3'}/${'g2'}`)
                .field('messageContent', 'TEST_Hello World!')
                .attach('images', fs.readFileSync('../server/images/pfp/brownie.png'), 'brownie.png')
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('updatedMessages');
            expect(res.body).to.have.property('currentMessage');

            // check if currentMessage is actually in res.body or not
            const currentMessage = res.body.currentMessage
            expect(currentMessage).to.include.keys('messageID', 'userID', 'groupID', 'channelID', "message", "images", "datetime")

            /*
                I can't really check if the image is stored correctly in the server since each picture has been added a unique suffix to ensure that it doesn't conflict with other images
            */
            expect(currentMessage.images).to.be.an('array');
            expect(currentMessage.images.length).to.equal(1);

            // check if the message gets added or not
            const isAdded = res.body.updatedMessages.some(m => m.messageID === currentMessage.messageID);
            expect(isAdded).to.be.true;
        })

        it("Should send a message WITHOUT an image", async function(){
            const res = await request(app)
                .post(`/api/addMessage/${'3'}/${'c3'}/${'g2'}`)
                .field('messageContent', 'TEST2_Hello World!')
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('updatedMessages');
            expect(res.body).to.have.property('currentMessage');

            // check if currentMessage is actually in res.body or not
            const currentMessage = res.body.currentMessage
            expect(currentMessage).to.include.keys('messageID', 'userID', 'groupID', 'channelID', "message", "images", "datetime")

            // the images array should be empty since we're not including any images
            expect(currentMessage.images).to.be.an('array');
            expect(currentMessage.images.length).to.equal(0);

            // check if the message gets added or not
            const isAdded = res.body.updatedMessages.some(m => m.messageID === currentMessage.messageID);
            expect(isAdded).to.be.true;
        })

    })

    describe("4. Profile Route", function() {
        it("Should add user to a group", async function(){
            const res = await request(app)
                .put(`/api/group/${'g4'}/add/${'3'}`)

            expect(res.status).to.equal(200);

            // confirm if user is in membership
            const membership = res.body.updatedMembership;
            const isAdded = membership.some(m => m.groupID == "g4" && m.userID == "3")
            expect(isAdded).to.be.true;

            // confirm if all requests dont have user's ID
            const requests = res.body.updatedRequests;
            requests.forEach(request => {
                expect(request.userID).to.not.equal('3');
            });
        })

        it("Should add a new channel to a group", async function(){
            const res = await request(app)
                .put(`/api/group/${"g4"}/addChannel/${"Amogus"}`)

            expect(res.body).to.be.an('array');

            // Confirm if the updated channel exist and is in the group
            const updatedChannel = res.body;
            const isAdded = updatedChannel.some(c => c.channelName == "Amogus" && c.groupID == "g4");
            expect(isAdded).to.be.true;
        })

        it("Should create new group and channel", async function(){
            const res = await request(app)
                .post(`/api/group/newGroup/${"TEST"}/${"TESTGroup"}/${"TestChannel"}`)
            
            expect(res.status).to.equal(200);

            const updatedUsers = res.body.updatedUsers
            const updatedMembership = res.body.updatedMembership
            const updatedGroup = res.body.updatedGroup
            const updatedChannel = res.body.updatedChannel

            // Check if user gets the groupAdmin role
            const hasAdmin = updatedUsers.some(u => u.id == "TEST" && u.roles.includes("groupAdmin"))
            expect(hasAdmin).to.be.true;

            // check if group exists
            const newGroup = updatedGroup.find(g => g.groupName === "TESTGroup");
            expect(newGroup).to.exist;

            newGroupID = newGroup.groupID;

            // check if superAdmin gets added into membership
            const superAdmins = updatedUsers.filter(u => u.roles.includes("superAdmin"));
            const membershipsForGroup = updatedMembership.filter(m => m.groupID === newGroupID);
            superAdmins.forEach(sa => {
                const inGroup = membershipsForGroup.some(m => m.userID === sa.id && m.role === "superAdmin");
                expect(inGroup, `SuperAdmin ${sa.id} should be in group ${newGroupID}`).to.be.true;
            });

            // check if channel exists
            const hasChannel = updatedChannel.some(c => c.channelName == "TestChannel")
            expect(hasChannel).to.be.true;
        })
    })
});

