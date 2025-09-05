class JoinRequest{
    constructor(requestID, userID, groupID, reasonToJoin = ""){
        this.requestID = requestID;
        this.userID = userID;
        this.groupID = groupID;
        this.reasonToJoin = reasonToJoin;
        this.datetime = new Date();
    }
}

module.exports = {JoinRequest}