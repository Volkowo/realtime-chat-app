import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Group } from './group/group';

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
    }
];
