import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { NoAuthGuard } from './shared/no-auth.guard';

const routes: Routes = [
  { path: '', children: [
    { path: 'login', canActivate: [NoAuthGuard], component: LoginComponent },
    { path: 'register', canActivate: [NoAuthGuard], component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
    // { path: '', redirectTo: '/tasks', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
