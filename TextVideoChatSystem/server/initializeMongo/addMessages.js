async function addMessages(collection){
    await collection.drop().catch(() => {});
    await collection.insertMany(
        [
            {
                "messageID": "m1",
                "userID": "1",
                "groupID": "g1",
                "channelID": "c1",
                "message": "Welcome to TestGroup!",
                "datetime": "2025-09-03T12:00:00.000Z"
            },
            {
                "messageID": "m2",
                "userID": "2",
                "groupID": "g1",
                "channelID": "c1",
                "message": "Hi everyone!",
                "datetime": "2025-09-03T12:01:00.000Z"
            },
            {
                "messageID": "m3",
                "userID": "4",
                "groupID": "g1",
                "channelID": "c2",
                "message": "Random thoughts here...",
                "datetime": "2025-09-03T12:05:00.000Z"
            },
            {
                "messageID": "m4",
                "userID": "5",
                "groupID": "g3",
                "channelID": "c5",
                "message": "Working on project phase 1",
                "datetime": "2025-09-03T12:10:00.000Z"
            },
            {
                "messageID": "m5",
                "userID": "6",
                "groupID": "g4",
                "channelID": "c6",
                "message": "Anyone into model trains?",
                "datetime": "2025-09-03T12:15:00.000Z"
            }
        ]
    )
}

module.exports = {addMessages}
