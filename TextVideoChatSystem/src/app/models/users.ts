export interface User {
    username: string;
    email: string;
    roles: [];
    groups: [];
    signedIn: boolean;
}