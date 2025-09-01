export class User {
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