import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.auth.isLogged()
      .do((logged) => {
        if (logged) {
          this.router.navigate(['/tasks']);
        }
      })
      .map(logged => !logged);
  }
}
