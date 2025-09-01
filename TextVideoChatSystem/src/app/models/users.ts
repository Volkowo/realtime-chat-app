export class User {
    constructor(
        public username: string = "",
        public email: string = "",
        public roles: any[] = [],
        public groups: any[] = [],
        public signedIn: boolean = false
    ){}

}