import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Observable } from 'rxjs/Observable';
import { User } from './users/shared/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit  {
  isLogged = false;
  loggedUser: User = {
    name: '',
    email: ''
  };
  constructor(
    private auth: AuthService,
  ) {}
  ngOnInit() {
    this.auth.isLogged().subscribe(logged => this.isLogged = logged);
    this.auth.getUserLogged().subscribe(user => this.loggedUser = user);
  }
}
