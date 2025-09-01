import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Data {
  getGroups() {
    return JSON.parse(localStorage.getItem('groups') || '[]');
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  saveGroups(groups: any[]) {
    localStorage.setItem('groups', JSON.stringify(groups));
  }

  saveUsers(users: any[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
