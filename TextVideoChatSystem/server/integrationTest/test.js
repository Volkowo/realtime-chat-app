const { app, initApp, client, getCollections } = require('../server');
const request = require('supertest'); 
const { expect } = require('chai');
const fs = require('fs');


describe('Auth Routes', function() {
    let userCollection;
    let newGroupID;
    let newRequestID;

    before(async function() {
        await initApp(true); 
        ({ userCollection, requestCollection, membershipCollection, messageCollection, groupCollection, channelCollection} = getCollections());

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

        await channelCollection.insertOne({
            channelID: "TEST",
            channelName: "TESTCHANNEL",
            groupID: "TEST"
        })

        await requestCollection.insertOne({
            requestID: "TEST",
            userID: "TEST",
            groupID: "TEST",
            reasonToJoin: "TESTING PURPOSE ONLY",
            datetime: "bruh"
        })
    });

    after(async function() {
        // Removes stuff that was added during testing
        await userCollection.deleteOne({ username: "testDB" });
        // await userCollection.deleteOne({ id: "TEST" });
        await groupCollection.deleteOne({groupID: "TEST"})
        await membershipCollection.insertOne({
            membershipID: "m22",
            userID: "3",
            groupID: "g2",
            role: "chatUser"
        })
        await membershipCollection.insertOne({
            membershipID: "m23",
            userID: "3",
            groupID: "g5",
            role: "chatUser"
        })
        await membershipCollection.insertOne({
            membershipID: "m25",
            userID: "5",
            groupID: "g1",
            role: "chatUser"
        })
        await channelCollection.insertOne({
            channelID: "c9",
            channelName: "physics",
            groupID: "g5"
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
        await channelCollection.deleteOne({
            channelName: "TestChannel"
        })
        await groupCollection.deleteOne({
            groupName: "TESTGroup"
        })
        await membershipCollection.deleteMany({
            groupID: newGroupID
        })
        await groupCollection.updateOne(
            {groupID: "g1"},
            {
                $set: {
                    bannedUsers: []
                }
            }
        )

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

        it("Should delete a group", async function(){
            const res = await request(app)
                .delete(`/api/group/${'TEST'}/remove`)
            
            expect(res.status).to.equal(200);
            const updatedMembership = res.body.updatedMembership
            const updatedGroup = res.body.updatedGroup
            const updatedChannel = res.body.updatedChannel

            // check if membership doesnt have groupID
            updatedMembership.forEach(membership => {
                expect(membership.groupID).to.not.equal('TEST');
            });

            // check if groupID doesnt exist
            updatedGroup.forEach(group => {
                expect(group.groupID).to.not.equal('TEST');
            });

            // check if there's any channel associated with group
            updatedChannel.forEach(channel => {
                expect(channel.groupID).to.not.equal('TEST');
                expect(channel.channelID).to.not.equal('TEST');
            });
        })

        it("Should delete a channel from a group", async function(){
            const res = await request(app)
                .delete(`/api/group/${'g5'}/channel/${'c9'}/remove`)

            // check if channelID is still in channelCollection
            res.body.forEach(channel => {
                expect(channel.channelID).to.not.equal('c9');
            });

            // check if channelID + groupID is still in channelCollection
            const hasChannel = res.body.some(c => c.channelID == "c9" && c.groupID == "g5")
            expect(hasChannel).to.be.false;
        })

        it("Should kick a user from a group", async function(){
            const res = await request(app)
                .delete(`/api/group/${'g5'}/user/${'3'}/kick`)
            
            // check if groupID + userID is still in membershipCollection
            const notKicked = res.body.some(m => m.userID == "3" && m.groupID == "g5")
            expect(notKicked).to.be.false;
        })

        it("Should ban a user from a group and also add them into the bannedUsers array list", async function(){
            const res = await request(app)
                .post(`/api/group/${'g1'}/user/${'5'}/ban`)
                .send('kickBanReason', 'you stink!')
            
            const updatedGroup = res.body.updatedGroup
            const updatedMembership = res.body.updatedMembership

            console.log("MEMBERSHIP: ", updatedMembership)

            // check if groupID + userID is still in membershipCollection
            const notBanned = updatedMembership.some(m => m.userID == "5" && m.groupID == "g1")
            expect(notBanned).to.be.false;

            // check if userID is in banned list of groupID
            const group = updatedGroup.find(g => g.groupID == "g1")
            const isUserBanned = group.bannedUsers.some(b => b.userID == "5")
            expect(isUserBanned).to.be.true;
        })

        it("Should create a request with empty reason", async function(){
            const res = await request(app)
                .post(`/api/request/join/${'g1'}/${"TEST"}`)
                .send({reasonToJoin: ""})

            expect(res.body).to.be.an("array")
            
            // check if request exist
            const newRequest = res.body.find(r => r.userID === "TEST" && r.groupID == "g1");
            expect(newRequest).to.exist;
        
            // check if request's reason to join is empty and if it gets changed to No reason was giveb
            expect(newRequest.reasonToJoin).to.equal("No reason was given")
        })

        it("Should create a request with actual reason", async function(){
            const res = await request(app)
                .post(`/api/request/join/${'g1'}/${"TEST"}`)
                .send({reasonToJoin: 'test test test'})

            expect(res.body).to.be.an("array")
            
            // check if request exist
            const newRequest = res.body.find(r => r.userID === "TEST");
            expect(newRequest).to.exist;
        
            // check if request's reason to join is empty
            expect(newRequest).to.not.equal("")
        })

        it("Should reject request and do nothing with user", async function(){
            const res = await request(app)
                .put(`/api/request/join/${"g1"}/${"TEST"}/${"wedontusets"}/${"reject"}`)

            const updatedMembership = res.body.updatedMembership;
            const updatedRequest = res.body.updatedRequest;
            
            // check if user is in membership
            const isMember = updatedMembership.find(m => m.userID === "TEST" && m.groupID == "g1");
            expect(isMember).to.not.exist;

            // check if request from user for that group is gone
            updatedRequest.forEach(request => {
                expect(!(request.userID === 'TEST' && request.groupID === 'g1')).to.be.true;
            });
        })

        it("Should approve request and include user into said group", async function(){
            const res = await request(app)
                .put(`/api/request/join/${"g1"}/${"TEST"}/${"wedontusets"}/${"approve"}`)

            const updatedMembership = res.body.updatedMembership;
            const updatedRequest = res.body.updatedRequest;
            
            // check if user is in membership
            const isMember = updatedMembership.find(m => m.userID === "TEST" && m.groupID == "g1");
            expect(isMember).to.exist;

            // check if request from user for that group is gone
            updatedRequest.forEach(request => {
                expect(!(request.userID === 'TEST' && request.groupID === 'g1')).to.be.true;
            });
        })

        it("Should delete a user and remove them from userCollection, requestCollection, and membershipCollection", async function() {
            const res = await request(app)
                .delete(`/api/user/${"TEST"}/delete`)
            
            const updatedUsers = res.body.updatedUsers
            const updatedMembership = res.body.updatedMemberships;
            const updatedRequest = res.body.updatedRequests;

            // check if userID is still in userCollection
            updatedUsers.forEach(user => {
                expect(user.id).to.not.equal('TEST');
            });

            // check if any request related to user is still there or not
            updatedRequest.forEach(request => {
                expect(request.userID).to.not.equal('TEST');
            });

            // check if there is any membership with userID
            updatedMembership.forEach(membership => {
                expect(membership.userID).to.not.equal('TEST');
            });
        })
    })
});

