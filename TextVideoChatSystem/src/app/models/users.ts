export class UserModel {
    constructor(
        public id: string = "",
        public email: string = "",
        public username: string = "",
        public pass: string = "",
        public avatar: string = "",
        public roles: any[] = [],
        public signedIn: boolean = false,
        public statusMessage: string = "",
        public dateJoined: string = ""
    ){}
}

export class LoggedInUser{
    constructor(
        public id: string = "",
        public email: string = "",
        public username: string = "",
        public avatar: string = "",
        public roles: any[] = [],
        public signedIn: boolean = false,
        public statusMessage: string = "",
        public dateJoined: string = ""
    ){}
}