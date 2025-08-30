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
    )
];

module.exports = {ChatUser, users};