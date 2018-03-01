import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, from  } from 'apollo-link';
import { AuthService } from '../services/auth.service';


@NgModule({
  imports: [
    HttpClientModule, // provides HttpClient for HttpLink
    ApolloModule,
    HttpLinkModule
  ],
  providers: [
    Apollo,
    HttpLink
  ],
  exports: [
    ApolloModule
  ]
})
export class AppApolloClientModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private auth: AuthService

  ) {
    const http = httpLink.create({ uri: 'http://localhost:3000/graphql' });
    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('x-access-token', this.auth.getToken())
      });
      return forward(operation);
    });
    const loadingMiddleware = new ApolloLink((operation, forward) => {
      console.log('APOLLO BEFORE LOADING MIDDLEWARE');
      return forward(operation);
    });
    const afterMiddleware = new ApolloLink((operation, forward) => {
      console.log('APOLLO AFTER LOADING MIDDLEWARE');
      return forward(operation);
    });
    apollo.create({
      link: from([loadingMiddleware, afterMiddleware, authMiddleware, http]),
      cache: new InMemoryCache()
    });
  }
}
