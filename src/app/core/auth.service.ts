import { Injectable } from '@angular/core';
import * as cookie from 'js-cookie';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as store from 'store2';
import { Router } from '@angular/router';
import { User } from '../users/shared/user.model';

// const COOKIE_NAME = 'x-access-token';
const TOKEN_KEY_NAME = 'Bearer Token';
const USER_KEY_NAME = 'Logged User';

@Injectable()
export class AuthService {
  private logged: BehaviorSubject<boolean>;
  private userLogged: BehaviorSubject<User>;
  constructor(private router: Router) {
    // const token = cookie.get(COOKIE_NAME);
    const token = store.get(TOKEN_KEY_NAME);
    const user = store.get(USER_KEY_NAME);
    this.logged = new BehaviorSubject(token ? true : false);
    this.userLogged = new BehaviorSubject(user);
  }
  loginIn(token: string, user: User): void {
    if (token.length < 10) {
      throw new Error('Error token is not set');
    }
    // cookie.set(COOKIE_NAME, token);
    store.set(TOKEN_KEY_NAME, token);
    store.set(USER_KEY_NAME, user);
    this.logged.next(true);
    this.userLogged.next(user);
  }
  logout(): void {
    // cookie.remove(COOKIE_NAME);
    store.remove(TOKEN_KEY_NAME);
    store.remove(USER_KEY_NAME);
    this.logged.next(false);
    this.userLogged.next(undefined);
  }
  getToken(): string {
    return store.get(TOKEN_KEY_NAME) || '';
  }
  getUserLogged(): Observable<User> {
    return this.userLogged;
  }
  getUser(): User {
    return store.get(USER_KEY_NAME);
  }
  isLogged(): Observable<boolean> {
    return this.logged;
  }
}
