async function addUsers(collection){
    await collection.drop().catch(() => {});

    await collection.insertMany(
        [
            {
                "id": "1",
                "email": "og@email.com",
                "username": "super",
                "pass": "123",
                "roles": [
                "chatUser",
                "superAdmin"
                ],
                "signedIn": false
            },
            {
                "id": "2",
                "email": "user2@email.com",
                "username": "userTwo",
                "pass": "123",
                "roles": [
                "chatUser",
                "groupAdmin"
                ],
                "signedIn": false
            },
            {
                "id": "3",
                "email": "user3@email.com",
                "username": "userThree",
                "pass": "123",
                "roles": [
                "chatUser",
                "groupAdmin"
                ],
                "signedIn": false
            },
            {
                "id": "5",
                "email": "user5@email.com",
                "username": "userFive",
                "pass": "123",
                "roles": [
                "chatUser",
                "groupAdmin"
                ],
                "signedIn": false
            },
            {
                "id": "6",
                "email": "user6@email.com",
                "username": "userSix",
                "pass": "123",
                "roles": [
                "chatUser"
                ],
                "signedIn": false
            },
            {
                "id": "7",
                "email": "user7@email.com",
                "username": "userSeven",
                "pass": "123",
                "roles": [
                "chatUser",
                "groupAdmin",
                "superAdmin"
                ],
                "signedIn": false
            },
            {
                "id": "Sep06_1903296",
                "email": "gooner@email.com",
                "username": "bruh",
                "pass": "123",
                "roles": [
                "chatUser",
                "groupAdmin",
                "superAdmin"
                ],
                "signedIn": false
            }
        ]
    )
}

module.exports = {addUsers}