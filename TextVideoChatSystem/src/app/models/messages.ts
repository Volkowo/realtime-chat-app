export class MessageModel {
    constructor(
        public messageID: string,
        public userID: string,
        public message: string,
        public datetime: Date = new Date()
    ) {}
}