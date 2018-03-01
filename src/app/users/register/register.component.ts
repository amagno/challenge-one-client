import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { makePasswordValidator } from '../../../utils/custom-validators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.buildRegisterForm();
  }
  ngOnDestroy() {
    this.registerForm.reset();
  }
  buildRegisterForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]]
    }, {
      validator: makePasswordValidator('password', 'confirmPassword')
    });
  }
  handleSubmit() {
    const { username, password } = this.registerForm.value;
    this.userService.register({ username, password }).subscribe(undefined, (error) => {
      this.registerForm.get('username').setErrors({ unique: true });
    });
  }

}
