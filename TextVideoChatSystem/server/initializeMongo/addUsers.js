async function addUsers(collection) {
    await collection.drop().catch(() => {});

    await collection.insertMany([
        {
            "id": "1",
            "email": "og@email.com",
            "username": "super",
            "pass": "123",
            "avatar": "images/pfp/brownie.png",
            "roles": ["chatUser", "superAdmin"],
            "signedIn": false,
            "statusMessage": "Hey, I am using ChatApp!",
            "dateJoined": new Date().toISOString()
        },
        {
            "id": "2",
            "email": "user2@email.com",
            "username": "userTwo",
            "pass": "123",
            "avatar": "images/pfp/defaultPFP.jpg",
            "roles": ["chatUser", "groupAdmin"],
            "signedIn": false,
            "statusMessage": "Available",
            "dateJoined": new Date().toISOString()
        },
        {
            "id": "3",
            "email": "user3@email.com",
            "username": "userThree",
            "pass": "123",
            "avatar": "images/pfp/defaultPFP.jpg",
            "roles": ["chatUser", "groupAdmin"],
            "signedIn": false,
            "statusMessage": "Busy",
            "dateJoined": new Date().toISOString()
        },
        {
            "id": "5",
            "email": "user5@email.com",
            "username": "userFive",
            "pass": "123",
            "avatar": "images/pfp/defaultPFP.jpg",
            "roles": ["chatUser", "groupAdmin"],
            "signedIn": false,
            "statusMessage": "At work",
            "dateJoined": new Date().toISOString()
        },
        {
            "id": "6",
            "email": "user6@email.com",
            "username": "userSix",
            "pass": "123",
            "avatar": "images/pfp/defaultPFP.jpg",
            "roles": ["chatUser"],
            "signedIn": false,
            "statusMessage": "Available",
            "dateJoined": new Date().toISOString()
        },
        {
            "id": "7",
            "email": "user7@email.com",
            "username": "userSeven",
            "pass": "123",
            "avatar": "images/pfp/defaultPFP.jpg",
            "roles": ["chatUser", "groupAdmin", "superAdmin"],
            "signedIn": false,
            "statusMessage": "Online",
            "dateJoined": new Date().toISOString()
        },
        {
            "id": "Sep06_1903296",
            "email": "gooner@email.com",
            "username": "bruh",
            "pass": "123",
            "avatar": "images/pfp/defaultPFP.jpg",
            "roles": ["chatUser", "groupAdmin", "superAdmin"],
            "signedIn": false,
            "statusMessage": "Chillin'",
            "dateJoined": new Date().toISOString()
        }
    ]);
}

module.exports = { addUsers };
