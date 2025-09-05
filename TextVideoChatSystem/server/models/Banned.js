class Banned{
    constructor(userID, reason = ""){
        this.userID = userID;
        this.reason = reason
    }
}

module.exports = {Banned}