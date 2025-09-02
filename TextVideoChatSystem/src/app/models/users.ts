export class UserModel {
    constructor(
        public id: string = "",
        public email: string = "",
        public username: string = "",
        public pass: string = "",
        public roles: any[] = [],
        public groups: any[] = [],
        public signedIn: boolean = false
    ){}
}

export class LoggedInUser{
    constructor(
        public id: string = "",
        public email: string = "",
        public username: string = "",
        public roles: any[] = [],
        public groups: any[] = [],
        public signedIn: boolean = false
    ){}
}