import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { Project } from './project.model';
import * as moment from 'moment';

export const validateStartDate = (finishInput: AbstractControl): ValidatorFn => (control: AbstractControl) => {
  if (!moment(control.value, 'DD/MM/YYYY').isValid()) {
    finishInput.disable();
    return { invalidDate: true };
  }
  if (moment(control.value, 'DD/MM/YYYY') > moment(finishInput.value, 'DD/MM/YYYYY')) {
    return { invalidDate: true };
  }
  finishInput.enable();
  return null;
};
export const validateFinishDate = (bossProjects: Project[], form: FormGroup): ValidatorFn => (control: AbstractControl) => {
  if (!moment(control.value, 'DD/MM/YYYY').isValid()) {
    return { invalidDate: true };
  }
  const startInput = form.get('start');
  const finishInput = form.get('finish');

  if (!startInput || !finishInput) {
    // console.log('invalid inputs');
    return null;
  }
  if (!bossProjects.length) {
    // console.log('invalid array');
    return null;
  }
  if (startInput.value > finishInput.value) {
    return { invalidDate: true };
  }
  let state = false;
  bossProjects.forEach(bp => {
    // console.log('PB', bp);
    const bpS = moment(bp.start, 'DD/MM/YYYY');
    const bpF = moment(bp.finish, 'DD/MM/YYYY');
    if (!state) {
      state = bpS.isBetween(startInput.value, finishInput.value)
        || bpF.isBetween(startInput.value, finishInput.value)
        || bpS.isSame(startInput.value)
        || bpF.isSame(finishInput.value);
    }
  });
  if (state) {
    return { betweenInvalidDate: true };
  }
  return null;
};

export const buildSearchRegex = (str = ''): RegExp => {
  const strArray = Array.from(str);
  const regexArray = strArray.map(word => {
      if (word === 'a') { return '[à-úÀ-ÚaA]'; }
      if (word === 'e') { return '[à-úÀ-ÚeE]'; }
      if (word === 'i') { return '[à-úÀ-ÚiI]'; }
      if (word === 'o') { return '[à-úÀ-ÚoO]'; }
      if (word === 'u') { return '[à-úÀ-ÚuU]'; }
      return word;
  });
  const strRegex = regexArray.toString().split(',').join('');
  return new RegExp(strRegex, 'ig');
};
