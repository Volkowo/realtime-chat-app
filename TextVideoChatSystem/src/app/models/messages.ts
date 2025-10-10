export class MessageModel {
    constructor(
        public messageID: string,
        public userID: string,
        public groupID: string,
        public channelID: string,
        public message: string,
        public images: string[],
        public datetime: string
    ) {}
}