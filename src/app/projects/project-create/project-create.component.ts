import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { makePasswordValidator } from '../../shared/utils/custom-validators';
import { User } from '../../users/shared/user.model';
import { UsersService } from '../../users/shared/users.service';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ProjectsService } from '../shared/projects.service';
import { Project, Menber } from '../shared/project.model';
import { AuthService } from '../../core/auth.service';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
const validateStartDate = (finishInput: AbstractControl): ValidatorFn => (control: AbstractControl) => {
  if (!moment(control.value, 'DD/MM/YYYY').isValid()) {
    finishInput.disable();
    return { invalidDate: true };
  }
  finishInput.enable();
  return null;
};
const validateFinishDate = (bossProjects: Project[], form: FormGroup): ValidatorFn => (control: AbstractControl) => {
  if (!moment(control.value, 'DD/MM/YYYY').isValid()) {
    return { invalidDate: true };
  }
  const startInput = form.get('start');
  const finishInput = form.get('finish');

  if (!startInput || !finishInput) {
    console.log('invalid inputs');
    return null;
  }
  if (!bossProjects.length) {
    console.log('invalid array');
    return null;
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
@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  // @ViewChild('pickerDateFinish') inputDateFinish: MatDatepicker<Moment>;
  changeFinishDate = new Subject<any>();
  createForm: FormGroup;
  private _users: User[] = [];
  private _menbers: Menber[] = [];
  bossProjects: Project[] = [];
  projects: Project[] = [];
  // todayDate = 'hee';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private projectsService: ProjectsService,
    private auth: AuthService,
    // private changeDetector: ChangeDetectorRef
    private router: Router
  ) { }
  private orderUsers(users: User[]): User[] {
    return _.orderBy(users, ['name'], ['asc']);
  }
  ngOnInit() {
    this.buildRegisterForm();
    this.projectsService.getAll().subscribe(p => {
      this.bossProjects = p.filter(b => b.boss._id === this.auth.getUser()._id);
      this.projects = p;
      this.createForm.get('finish').setValidators(validateFinishDate(this.bossProjects, this.createForm));
    });
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
    this.changeFinishDate.distinctUntilChanged().subscribe(() => this.handleChangeFinishDate());
    this.createForm.get('start').setValidators(validateStartDate(this.createForm.get('finish')));
    let textEvent;
    this.createForm.get('finish')
      .valueChanges
      .subscribe(() => {
        const startInput = this.createForm.get('start');
        const finishInput = this.createForm.get('finish');

        if (startInput.valid && finishInput.valid) {
          if (finishInput.value !== textEvent) {
            textEvent = finishInput.value;
            this.changeFinishDate.next(true);
          }
          // console.log(startInput.pristine, finishIndput.pristine);
        } else {
          if (finishInput.value !== textEvent) {
            textEvent = finishInput.value;
            this.changeFinishDate.next(false);
          }
        }
      });
  }
  ngOnDestroy() {
    console.log(this.bossProjects);
    this.createForm.reset();
  }
  datePickerFilter = (bossProjects: Project[]) => (date: Moment): boolean => {
    let status = true;
    bossProjects.forEach(bp => {
      const start = moment(bp.start, 'DD/MM/YYYY');
      const finish = moment(bp.finish, 'DD/MM/YYYY');
      if (status) {
        status = !(date.isBetween(start, finish) || date.isSame(start) || date.isSame(finish));
      }
    });
    return status;
  }
  buildRegisterForm() {
    this.createForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(130)]],
      // description: [''],
      start: [{ value: null, disabled: false }, [Validators.required]],
      finish: [{ value: null, disabled: true }, [Validators.required]],
      team: [null],
    });
  }
  handleSubmit() {
    const submitValues = Object.assign({}, {
      ...this.createForm.value,
      team: this.menbers
    }) as Project;
    console.log(submitValues);
    this.projectsService.create(submitValues).subscribe(async res => {
      console.log(res);
      await this.router.navigate(['/projects']);
    }, error => {
      console.log(error);
    });
    // console.log();
  }
  selectUser(user: Menber) {


    const menber = Object.assign({}, {
      ...user,
      workloadProject: 1
    });
    this.menbers = [
      ...this.menbers,
      menber
    ];
    this.users = this.users.filter(u => u._id !== user._id);
  }
  diselectUser(user: User) {
    this.users = [
      ...this.users,
      user
    ];
    this.menbers = this.menbers.filter(u => u._id !== user._id);
  }
  get users(): Menber[] {
    return this._users;
  }
  set users(users: Menber[]) {
    this._users = this.orderUsers(users);
  }
  get menbers(): Menber[] {
    return this._menbers;
  }
  set menbers(users: Menber[]) {
    this._menbers = this.orderUsers(users);
  }
  get startDate(): Moment {
    return moment(this.createForm.get('start').value).add(1, 'd');
  }
  handleChangeFinishDate() {
    console.log('CHANGE!!!!');
    const startInput = this.createForm.get('start');
    const finishInput = this.createForm.get('finish');
      console.log('CHANGE');
      this.projects.forEach(p => {
        const start = moment(p.start, 'DD/MM/YYYY');
        const finish = moment(p.finish, 'DD/MM/YYYY');
        const startCheck = start.isBetween(startInput.value, finishInput.value)
        || start.isSame(startInput.value)
        || start.isSame(finishInput.value);
        const finishCheck = finish.isBetween(startInput.value, finishInput.value)
        || finish.isSame(startInput.value)
        || finish.isSame(finishInput.value);
        this.users = this.users.map(u => {
          console.log('USERS ====> ', u);
          const workloadAvalTeam = _.compact(p.team.map<number>(t => {
            console.log('TEAM ====>', t);
            if (t._id === u._id) {
              if (startCheck || finishCheck) {
                if (t.workloadProject === t.workload) {
                  return 1;
                }
                if (typeof t.workloadProject !== 'undefined' && typeof t.workload !== 'undefined') {
                  console.log(t.workload);
                  console.log(t.workloadProject);
                  console.log(t.workloadAvailable);
                  return (t.workload - t.workloadProject) + 1;
                }
              }
              return t.workload + 1;
            }
          }));
          const aval = workloadAvalTeam[0] === NaN || !workloadAvalTeam[0] ? u.workload + 1 : workloadAvalTeam[0];
          console.log('WORK AVAL ===> ', aval);
          console.log('USER WORK AVAL ===> ', u.workloadAvailable);
            return {
              ...u,
              workloadAvailable: aval - 1
            };
        });
        console.log('NEW USERS ===> ', this.users);
      });
  }
  clickToError() {
    console.log('SET ERROR');
    this.createForm.get('start').setErrors({ betweenInvalidDate: true });
    this.createForm.get('finish').setErrors({ betweenInvalidDate: true });
    console.log(this.createForm.get('finish'));
  }
}
