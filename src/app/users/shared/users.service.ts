import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/services/auth.service';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}
  private doLogin(observable: Observable<any>, queryName: string): Observable<any> {
    return observable.do(async ({ data }) => {
      const { key, user } = data[queryName];
      this.auth.loginIn(key, user);
      await this.router.navigate(['/', 'tasks']);
    });
  }
  // LOGIN
  login({ username, password }: { username: string, password: string }) {
  }
  // REGISTER
  register({ username, password }: { username: string, password: string }) {
  }
  // LOGOUT
  logout(): void {
    this.auth.logout();
  }
}
