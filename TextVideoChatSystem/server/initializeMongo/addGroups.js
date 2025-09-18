async function addGroups(collection){
    await collection.drop().catch(() => {});

    await collection.insertMany(
        [
            {
                "groupID": "g1",
                "groupName": "TestGroup",
                "bannedUsers": []
            },
            {
                "groupID": "g2",
                "groupName": "FunGroup",
                "bannedUsers": []
            },
            {
                "groupID": "g3",
                "groupName": "ProjectGroup",
                "bannedUsers": []
            },
            {
                "groupID": "g4",
                "groupName": "HobbyGroup",
                "bannedUsers": []
            },
            {
                "groupID": "g5",
                "groupName": "StudyGroup",
                "bannedUsers": []
            },
            {
                "groupID": "gSep05_1007132",
                "groupName": "Burrito",
                "bannedUsers": []
            },
            {
                "groupID": "gSep05_1626400",
                "groupName": "test123",
                "bannedUsers": [
                {
                    "userID": "6",
                    "reason": ""
                },
                {
                    "userID": "3",
                    "reason": "test"
                }
                ]
            },
            {
                "groupID": "gSep05_16302713",
                "groupName": "etet",
                "bannedUsers": [
                {
                    "userID": "3",
                    "reason": "stinky"
                }
                ]
            },
            {
                "groupID": "gSep05_1846285",
                "groupName": "asasdadada",
                "bannedUsers": []
            },
            {
                "groupID": "gSep05_2357059",
                "groupName": "PLEASE WORK",
                "bannedUsers": []
            },
            {
                "groupID": "gSep06_21101417",
                "groupName": "TESTTEST",
                "bannedUsers": []
            },
            {
                "groupID": "gSep06_2113193",
                "groupName": "bruh",
                "bannedUsers": []
            },
            {
                "groupID": "gSep11_09093619",
                "groupName": "TestGroup",
                "bannedUsers": []
            },
            {
                "groupID": "gSep11_0910496",
                "groupName": "NewGroup",
                "bannedUsers": []
            }
        ]
    )
}

module.exports = {addGroups}

