const { readJSON, writeJSON } = require('../models/jsonHelper');
const path = require('path');
const multer = require('multer');

const messageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images/server/message'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: messageStorage })


function route(app, membershipCollection, groupCollection, messageCollection, io) {
    // ROUTE

    // get user's group list
    app.get('/api/groups/:userID', async function(req, res) {
        const userID = req.params.userID;
        console.log("userID (backend): ", userID)
        if (!userID) {
            return res.sendStatus(400);
        }

        const groupsUserIn = await membershipCollection.find({userID: userID}).toArray()
        const groupIDs = groupsUserIn.map(group => group.groupID);
        console.log("BACKEND LIST OF GROUP ID: ", groupIDs);

        const groupDetails = await groupCollection.find({
            groupID : {$in: groupIDs}
        }).toArray();

        console.log("GROUP DETAILS: ", groupDetails);

        if(groupDetails){
            res.json(groupDetails)
        } else{
            console.log("no grpups..?")
        }
    })

    // Leave Group
    app.delete('/api/group/:groupID/:userID/leave', async function(req, res){
        const groupID = req.params.groupID;
        const userID = req.params.userID;

        const membership = await membershipCollection.deleteOne({groupID: groupID, userID: userID})

        const groupsUserIn = await membershipCollection.find({userID: userID}).toArray()
        const groupIDs = groupsUserIn.map(group => group.groupID);
        console.log("BACKEND LIST OF GROUP ID: ", groupIDs);

        const groupDetails = await groupCollection.find({
            groupID : {$in: groupIDs}
        }).toArray();

        
        res.json(groupDetails)
    })

    // add message
    app.post('/api/addMessage/:userID/:channelID/:groupID', upload.array('images'), async function(req, res){
        var imageArray = []
        const userID = req.params.userID;
        const channelID = req.params.channelID;
        const groupID = req.params.groupID;
        const message = req.body.messageContent;
        const datetime = new Date().toString();
        const images = req.files;

        for(let image of images){
            var imageURL = `images/server/message/${image.filename}`
            imageArray.push(imageURL)
        }

        var date_split = datetime.split(" ")
        var dateForID = date_split[4].split(":").join("");
        var messageID = `msg${date_split[1]}${date_split[2]}_${dateForID}${Math.floor(Math.random() * 20)}`

        console.log("Backend Image: ", images)

        console.log(
            `
                UserID: ${userID}
                ChannelID: ${channelID}
                GroupID: ${groupID}
                Message: ${message}
                Current Date: ${datetime}
            `
        )

        let messageObject = {
                messageID: messageID,
                userID: userID,
                groupID: groupID,
                channelID: channelID,
                message: message,
                images: imageArray,
                datetime: datetime
        }

        await messageCollection.insertOne(
            messageObject
        )

        const updatedMessages = await messageCollection.find({groupID: groupID, channelID: channelID}).toArray();
        const currentMessage = await messageCollection.findOne({messageID: messageID})
        console.log("Emitting message to channel", channelID, messageObject);
        io.to(channelID).emit("message", messageObject)

        res.json({updatedMessages, currentMessage});
    })
}

module.exports = { route };