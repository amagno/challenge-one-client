import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    // private userService: UsersService
  ) {
    // this.userService.logout();
  }

  async ngOnInit() {
    await this.router.navigate(['/login']);
  }

}
