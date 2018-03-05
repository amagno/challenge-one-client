import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../users/shared/user.model';
import { UsersService } from '../../users/shared/users.service';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material';
import { ProjectsService } from '../shared/projects.service';
import { Project, Menber } from '../shared/project.model';
import { AuthService } from '../../core/auth.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { validateFinishDate, validateStartDate } from '../shared/utils';
import * as moment from 'moment';
import * as _ from 'lodash';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  // @ViewChild('pickerDateFinish') inputDateFinish: MatDatepicker<Moment>;
  private _users: User[] = [];
  private _menbers: Menber[] = [];
  private edit = false;
  private editId: string;
  changeFinishDate = new Subject<any>();
  createForm: FormGroup;
  bossProjects: Project[] = [];
  projects: Project[] = [];
  subscribes: Subscription[];
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private projectsService: ProjectsService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  private orderUsers(users: User[]): User[] {
    return _.orderBy(users, ['name'], ['asc']);
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
  ngOnInit() {
    this.buildRegisterForm();
    // Edit subscribe
    this.route.params.subscribe(({ id }) => {
      // console.log(param.id);
      if (id) {
        this.projectsService.getById(id).subscribe(res => {
          this.edit = true;
          this.editId = id;
          this.createForm.setValue({
            name: res.name,
            description: res.description || '',
            start: moment(res.start, 'DD/MM/YYYYY'),
            finish: moment(res.finish, 'DD/MM/YYYY'),
            team: null
          });
          this.menbers = res.team;
        });
      }
    });
    // Get project and boss projects
    this.projectsService.getAll().subscribe(p => {
      this.bossProjects = p.filter(b => {
        if (this.edit === true) {
          return b.boss._id === this.auth.getUser()._id && b._id !== this.editId;
        }
        return b.boss._id === this.auth.getUser()._id;
      });
      this.projects = p;
      this.createForm.get('finish').setValidators(validateFinishDate(this.bossProjects, this.createForm));
    });
    // Get users
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
    // Finish date change function
    this.changeFinishDate.subscribe(() => {
      console.log('DATE CHANGED');
      this.menbers = [];
      this.handleChangeFinishDate();
    });
    this.createForm.get('start').setValidators(validateStartDate(this.createForm.get('finish')));
    // Handle change finish date
    let textEvent;
    this.createForm.get('finish').valueChanges.subscribe(() => {
      const startInput = this.createForm.get('start');
      const finishInput = this.createForm.get('finish');
      if (startInput.valid && finishInput.valid) {
        if (finishInput.value !== textEvent) {
          textEvent = finishInput.value;
          this.changeFinishDate.next(true);
        }
      } else {
        if (finishInput.value !== textEvent) {
          textEvent = finishInput.value;
          this.changeFinishDate.next(false);
        }
      }
    });
  }
  ngOnDestroy() {
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
      description: [''],
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
    if (this.edit === false) {
      this.projectsService.create(submitValues).subscribe(async res => {
        console.log(res);
        await this.router.navigate(['/projects']);
      }, error => {
        console.log(error);
      });
    }
    if (this.edit === true) {
      this.projectsService.edit(this.editId, submitValues).subscribe(async res => {
        console.log(res);
        await this.router.navigate(['/projects']);
      });
    }
  }
  selectUser(user: Menber) {
    const menber = Object.assign({}, {
      ...user,
      workloadProject: 1
    });
    this.menbers = _.orderBy([
      ...this.menbers,
      menber
    ], ['name'], ['asc']);
    this.users = this.users.filter(u => u._id !== user._id);
  }
  diselectUser(user: User) {
    this.users = [
      ...this.users,
      user
    ];
    this.menbers = this.menbers.filter(u => u._id !== user._id);
  }
  handleChangeFinishDate() {
    const startInput = this.createForm.get('start');
    const finishInput = this.createForm.get('finish');
    if (this.projects.length === 0) {
      this.users = this.users.map(u => ({
        ...u,
        workloadAvailable: u.workload
      }));
      return;
    }
    let runned = false;
    this.projects.forEach(p => {
      const start = moment(p.start, 'DD/MM/YYYY');
      const finish = moment(p.finish, 'DD/MM/YYYY');
      const startCheck = start.isBetween(startInput.value, finishInput.value)
        || start.isSame(startInput.value)
        || start.isSame(finishInput.value);
      const finishCheck = finish.isBetween(startInput.value, finishInput.value)
        || finish.isSame(startInput.value)
        || finish.isSame(finishInput.value);
      if (startCheck || finishCheck) {
        this.users = this.users.map(u => {
          // console.log('USERS ====> ', u);
          const workloadAvalTeam = _.compact(p.team.map<number>(t => {
            // console.log('TEAM ====>', t);
            if (t._id === u._id) {
              if (t.workloadProject === t.workload) {
                return 1;
              }
              if (typeof t.workloadProject !== 'undefined' &&
                typeof t.workload !== 'undefined') {
                return (t.workload - t.workloadProject) + 1;
              }
              return t.workload + 1;
            }
            // console.log('NEW USERS ===> ', this.users);
          }));
          // console.log('WORK LOAD', workloadAvalTeam[0], u.workloadAvailable, u.workload);
          const aval = typeof workloadAvalTeam[0] !== 'undefined' ? workloadAvalTeam[0] : u.workload + 1;
          // console.log('WORK AVAL ===> ', aval);
          // console.log('USER WORK AVAL ===> ', u.workloadAvailable);
          runned = true;
          return {
            ...u,
            workloadAvailable: aval - 1
          };
        });
      } else {
        // (!u.workloadAvailable && u.workloadAvailable !== 0)
        this.users = this.users.map(u => ({
          ...u,
          workloadAvailable: !runned ? u.workload : u.workloadAvailable
        }));
      }
    });
  }
}
