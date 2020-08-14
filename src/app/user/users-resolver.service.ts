import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import { User } from './user.model';
import {UserService} from './user.service';

@Injectable({providedIn: 'root'})
export class UsersResolverService implements Resolve<User[]>{
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const users = this.userService.getUsers();
    if (users.length === 0) {
      return this.userService.fetchUsers();
    } else {
      return users;
    }
  }
}
