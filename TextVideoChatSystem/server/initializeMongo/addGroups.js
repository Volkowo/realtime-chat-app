async function addGroups(collection) {
    await collection.drop().catch(() => {});

    await collection.insertMany([
        {
            "groupID": "g1",
            "groupName": "TestGroup",
            "bannedUsers": [],
            "serverPic": "images/server/serverPic/unknown.png" 
        },
        {
            "groupID": "g2",
            "groupName": "FunGroup",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "g3",
            "groupName": "ProjectGroup",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "g4",
            "groupName": "HobbyGroup",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "g5",
            "groupName": "StudyGroup",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep05_1007132",
            "groupName": "Burrito",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep05_1626400",
            "groupName": "test123",
            "bannedUsers": [
                { "userID": "6", "reason": "" },
                { "userID": "3", "reason": "test" }
            ],
            "serverPic": ""
        },
        {
            "groupID": "gSep05_16302713",
            "groupName": "etet",
            "bannedUsers": [
                { "userID": "3", "reason": "stinky" }
            ],
            "serverPic": ""
        },
        {
            "groupID": "gSep05_1846285",
            "groupName": "asasdadada",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep05_2357059",
            "groupName": "PLEASE WORK",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep06_21101417",
            "groupName": "TESTTEST",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep06_2113193",
            "groupName": "bruh",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep11_09093619",
            "groupName": "TestGroup",
            "bannedUsers": [],
            "serverPic": ""
        },
        {
            "groupID": "gSep11_0910496",
            "groupName": "NewGroup",
            "bannedUsers": [],
            "serverPic": ""
        }
    ]);
}

module.exports = { addGroups };
