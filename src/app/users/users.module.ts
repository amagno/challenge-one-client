import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { AppStylesModule } from '../app-styles.module';
// import { UserRoutingModule } from './user-routing.module';
// import { UserService } from './user.service';
// import { NoAuthGuard } from './no-auth.guard';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UsersService } from './shared/users.service';
import { UsersRoutingModule } from './users-routing.module';
import { NoAuthGuard } from './shared/no-auth.guard';
import { StylesModule } from '../shared/styles.module';

@NgModule({
  imports: [
    CommonModule,
    // StylesModule,
    // AppStylesModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    StylesModule
    // StylesModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent
  ],
  providers: [
    UsersService,
    NoAuthGuard
  ]
})
export class UsersModule { }
