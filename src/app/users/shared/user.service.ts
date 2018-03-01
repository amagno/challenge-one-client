import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

export interface User {
  id?: string | number;
  username?: string;
}
export interface Token {
  key: string;
}
const loginMutation = gql`
  mutation loginMutation($username: String!, $password: String!) {
    login(input: {
      username: $username
      password: $password
    }) {
      key
      user {
        username
      }
    }
  }
`;
const registerMutation = gql`
  mutation registerMutation($username: String!, $password: String!) {
    addUser(input: {
      username: $username
      password: $password
    }) {
      key
      user {
        username
      }
    }
  }
`;

@Injectable()
export class UserService {
  private user: Observable<ApolloQueryResult<User>>;
  constructor(
    private apollo: Apollo,
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
  login({ username, password }: { username: string, password: string }): Observable<ApolloQueryResult<{
    login: Token
  }>> {
    const observable = this.apollo.mutate<{ login: Token }>({
      mutation: loginMutation,
      variables: {
        username,
        password
      }
    });
    return this.doLogin(observable, 'login');
  }
  // REGISTER
  register({ username, password }: { username: string, password: string }): Observable<ApolloQueryResult<{
    addUser: Token
  }>> {
    const observable = this.apollo.mutate<{ addUser: Token }>({
      mutation: registerMutation,
      variables: {
        username,
        password
      }
    });
    return this.doLogin(observable, 'addUser');
  }
  // LOGOUT
  logout(): void {
    this.auth.logout();
  }
}
