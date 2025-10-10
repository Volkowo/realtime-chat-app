export class GroupModel{
    constructor(
        public groupID: string = "",
        public groupName: string = "",
        public bannedUsers: string[] = [],
        public serverPic: string = ""
    ){}
}