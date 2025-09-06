export class JoinRequestModel {
    constructor(
        public requestID: string,
        public userID: string,
        public groupID: string,
        public reasonToJoin: string,
        public datetime: Date = new Date()
    ){}
}
