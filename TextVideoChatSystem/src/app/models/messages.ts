export class MessageModel {
    constructor(
    public userID: string,
    public message: string,
    public datetime: Date = new Date()
    ) {}
}