import { AbstractControl } from '@angular/forms';

export const makePasswordValidator = (passwordField1: string, passwordField2: string) => {
  return (control: AbstractControl)  => {
    const p1 = control.get(passwordField1);
    const p2 = control.get(passwordField2);
    if (p1.value !== p2.value) {
      p1.setErrors({ ...p1.errors, invalidPassword: true });
      p2.setErrors({ ...p2.errors, invalidPassword: true });
    } else {
      if (p1.errors) {
        if (p1.errors.invalidPassword) {
          delete p1.errors.invalidPassword;
        }
        Object.keys(p1.errors).length > 0  ? p1.setErrors({ ...p1.errors }) : p1.setErrors(null);
      } else {
        p1.setErrors(null);
      }
      if (p2.errors) {
        if (p2.errors.invalidPassword) {
          delete p2.errors.invalidPassword;
        }
        Object.keys(p2.errors).length > 0  ? p2.setErrors({ ...p2.errors }) : p2.setErrors(null);
      } else {
        p2.setErrors(null);
      }
    }
  };
};
