import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../shared/users.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildloginForm();
  }
  ngOnDestroy() {
    this.loginForm.reset();
  }
  buildloginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  handleSubmit() {
    const { email, password } = this.loginForm.value;

    console.log(email, password);
    this.usersService.login({ email, password }).subscribe((res) => {
      console.log('LOG IN ========> ', res);
      this.auth.loginIn(res.token, res.user);
      this.router.navigate(['/projects']);
    }, (error) => {
      // console.log(error);
      this.loginForm.reset();
      this.loginForm.get('email').setErrors({ invalid: true });
      this.loginForm.get('password').setErrors({ invalid: true });
    });
  }

}
