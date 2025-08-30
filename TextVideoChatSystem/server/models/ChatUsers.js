class ChatUser{
    constructor(id, email, username, pass, roles = ["chatUser"], groups){
        this.id = id;
        this.email = email;
        this.username = username;
        this.pass = pass;
        this.roles = roles;
        this.groups = groups;
        this.signedIn = false;
    }
}

const users = [
    new ChatUser(
        "1",
        "og@email.com",
        "super",
        "123",
        ["chatUser", "superAdmin"],
        [{ group: "TestGroup", role: "superAdmin" }]
    ),
    new ChatUser("2", "user2@email.com", "userTwo", "123", ["chatUser"], [{ group: "1", role: "member" }, { group: "2", role: "member" }]),
    new ChatUser("3", "user3@email.com", "userThree", "123", ["chatUser", "groupAdmin"], [{ group: "2", role: "groupAdmin" }]),
    new ChatUser("4", "user4@email.com", "userFour", "123", ["chatUser"], [{ group: "1", role: "member" }]),
    new ChatUser("5", "user5@email.com", "userFive", "123", ["chatUser"], [{ group: "3", role: "member" }])
];

module.exports = {ChatUser, users};