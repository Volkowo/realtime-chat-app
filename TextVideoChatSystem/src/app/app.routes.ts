import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Group } from './group/group';
import { Profile } from './profile/profile';
import { Register } from './register/register';

export const routes: Routes = [
    {
        path: "",
        component: Login,
        title: "Login"
    },
    {
        path: "login",
        component: Login,
        title: "Login"
    },
    {
        path: "group",  
        component: Group,
        title: "Group"
    },
    {
        path: "profile",
        component: Profile,
        title: "Profile"
    },
    {
        path: "register",
        component: Register,
        title: "Register"
    }
];
