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

@NgModule({
  imports: [
    CommonModule,
    // AppStylesModule,
    ReactiveFormsModule,
    // UserRoutingModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LogoutComponent
  ],
  providers: [
    // UserService,
    // NoAuthGuard
  ]
})
export class UsersModule { }
