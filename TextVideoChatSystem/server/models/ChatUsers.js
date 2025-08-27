class ChatUser{
    constructor(id, email, username, password, roles = ["chatUser"], groups){
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.groups = groups;
        this.signedIn = false;
    }
}

const users = [
    new ChatUser(
        "1",
        "ogsuperadmin@email.com",
        "abc",
        "123",
        ["chatUser", "superAdmin"],
        [{ group: "TestGroup", role: "superAdmin" }]
    )
];

module.exports = {ChatUser, users};