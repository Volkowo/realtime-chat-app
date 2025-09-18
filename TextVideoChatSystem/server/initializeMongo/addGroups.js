async function addGroups(collection){
    await collection.drop().catch(() => {});

    await collection.insertMany(
        [
            {
                "groupID": "g1",
                "groupName": "TestGroup",
                "users": [
                "1",
                "2",
                "3",
                "5",
                "6",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "g2",
                "groupName": "FunGroup",
                "users": [
                "1",
                "2",
                "7",
                "6",
                "5",
                "3",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "g3",
                "groupName": "ProjectGroup",
                "users": [
                "1",
                "5",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "g4",
                "groupName": "HobbyGroup",
                "users": [
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "g5",
                "groupName": "StudyGroup",
                "users": [
                "1",
                "3",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep05_1007132",
                "groupName": "Burrito",
                "users": [
                "2",
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep05_1626400",
                "groupName": "test123",
                "users": [
                "1",
                "6",
                "7",
                "Sep06_1903296"
                ],
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
                "users": [
                "1",
                "5",
                "7",
                "Sep06_1903296"
                ],
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
                "users": [
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep05_2357059",
                "groupName": "PLEASE WORK",
                "users": [
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep06_21101417",
                "groupName": "TESTTEST",
                "users": [
                "2",
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep06_2113193",
                "groupName": "bruh",
                "users": [
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep11_09093619",
                "groupName": "TestGroup",
                "users": [
                "1",
                "7",
                "Sep06_1903296",
                "2",
                "5"
                ],
                "bannedUsers": []
            },
            {
                "groupID": "gSep11_0910496",
                "groupName": "NewGroup",
                "users": [
                "1",
                "7",
                "Sep06_1903296"
                ],
                "bannedUsers": []
            }
        ]
    )
}

module.exports = {addGroups}

