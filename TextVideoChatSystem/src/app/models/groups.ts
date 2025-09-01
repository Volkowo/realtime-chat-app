export class Group{
    constructor(
        public groupID: string = "",
        public groupName: string = "",
        public channels: any[] = [],
        public users: any[] = []
    ){}
}