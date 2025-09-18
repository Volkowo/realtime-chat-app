async function addJoinRequest(collection){
    await collection.drop().catch(() => {});

    await collection.insertMany(
        [
            {
                "requestID": "4",
                "userID": "7",
                "groupID": "g3",
                "reasonToJoin": "Want to share resources with the group.",
                "datetime": "2025-09-06T07:45:00.000Z"
            }
        ]
    )
}

module.exports = {addJoinRequest}