import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { makePasswordValidator } from '../../shared/utils/custom-validators';
import { UsersService } from '../shared/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildRegisterForm();
  }
  ngOnDestroy() {
    this.registerForm.reset();
  }
  buildRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(130)]],
      email: ['', [Validators.required, ]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
      birth: [null, [Validators.required]],
      workload: [null, [Validators.required]]
    }, {
      validator: makePasswordValidator('password', 'confirmPassword')
    });
  }
  handleSubmit() {
    // const { username, password } = this.registerForm.value;
    const values = Object.assign({}, {
      ...this.registerForm.value,
      confirmPassword: undefined
    });
    this.userService.register(values).subscribe(res => {
      console.log(res);
      this.router.navigate(['/login']);
    }, error => {
      this.registerForm.get('email').setErrors({ unique: true });
    });
  }

}
