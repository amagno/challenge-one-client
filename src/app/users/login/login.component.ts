import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    // private usersService: UsersService
  ) { }

  ngOnInit() {
    this.buildloginForm();
  }
  ngOnDestroy() {
    this.loginForm.reset();
  }
  buildloginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  handleSubmit() {
    const { username, password } = this.loginForm.value;
    // this.userService.login({ username, password }).subscribe(undefined, (error) => {
    //   // console.log(error);
    //   this.loginForm.reset();
    //   this.loginForm.get('username').setErrors({ invalid: true });
    //   this.loginForm.get('password').setErrors({ invalid: true });
    // });
  }

}
