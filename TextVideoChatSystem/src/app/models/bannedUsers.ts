export class BannedUserModel {
    constructor(
        public userID: string,
        public reason: string = "",
    ){}
}
