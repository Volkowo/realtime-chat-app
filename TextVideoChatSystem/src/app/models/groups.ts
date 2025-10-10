import { ChannelModel } from './channels';
export class GroupModel{
    constructor(
        public groupID: string = "",
        public groupName: string = "",
        public channels: ChannelModel[] = [],
        public users: string[] = [],
        public serverPic: string = ""
    ){}
}