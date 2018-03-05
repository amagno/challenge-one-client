import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../shared/users.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    // this.userService.logout();
    this.auth.logout();
  }

  async ngOnInit() {
    await this.router.navigate(['/login']);
  }

}
