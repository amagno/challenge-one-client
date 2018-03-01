import { Injectable } from '@angular/core';
import * as cookie from 'js-cookie';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as store from 'store2';
import { Router } from '@angular/router';

const COOKIE_NAME = 'x-access-token';

@Injectable()
export class AuthService {
  private logged = new BehaviorSubject<boolean>(false);
  private userLogged = new BehaviorSubject<any>(store.get('user'));
  constructor(private router: Router) {
    const token = cookie.get(COOKIE_NAME);
    if (token) {
      this.logged.next(true);
    } else {
      this.logged.next(false);
    }
  }
  loginIn(token: string, user): void {
    if (token.length < 10) {
      throw new Error('Error token isot set');
    }
    cookie.set(COOKIE_NAME, token);
    store.set('user', user);
    this.logged.next(true);
    this.userLogged.next(user);
  }
  logout(): void {
    cookie.remove(COOKIE_NAME);
    store.remove('user');
    this.logged.next(false);
    this.userLogged.next(undefined);
  }
  getToken(): string {
    return cookie.get(COOKIE_NAME) || '';
  }
  getUserLogged(): Observable<any> {
    return this.userLogged;
  }
  isLogged(): Observable<boolean> {
    return this.logged;
  }
}
