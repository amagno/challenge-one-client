import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Token } from './token.model';
import { User } from './user.model';

const API_URL = 'http://localhost:3000/api';


@Injectable()
export class UsersService {

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  private doLogin(observable: Observable<any>, queryName: string): Observable<any> {
    return observable.do(async ({ data }) => {
      const { key, user } = data[queryName];
      this.auth.loginIn(key, user);
      await this.router.navigate(['/', 'tasks']);
    });
  }
  // LOGIN
  login({ email, password }: { email: string, password: string }): Observable<Token> {
    return this.http.post<Token>(`${API_URL}/login`, { email, password });
  }
  // REGISTER
  register(user: User): Observable<User> {
    return this.http.post<User>(`${API_URL}/register`, user);
  }
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/users`);
  }
  // LOGOUT
  logout(): void {
    this.auth.logout();
  }
}
