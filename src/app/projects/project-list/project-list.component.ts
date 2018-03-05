import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project.model';
import { ProjectsService } from '../shared/projects.service';
import { Subject } from 'rxjs/Subject';
import { AuthService } from '../../core/auth.service';
import { User } from '../../users/shared/user.model';
import 'rxjs/add/operator/debounceTime';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  private _searchProjects: Project[] = [];
  projects: Project[] = [];
  searchValue = new Subject();
  loggedUser: User;
  constructor(
    private projectsService: ProjectsService,
    private auth: AuthService,
    private router: Router
  ) {
    moment.locale('pt-br');
  }
  set searchProjects(projects: Project[]) {
    this._searchProjects = _.orderBy(projects, ['name'], ['asc']);
  }
  get searchProjects(): Project[] {
    return this._searchProjects;
  }
  ngOnInit() {
    this.loggedUser = this.auth.getUser();
    this.projectsService.getAll().subscribe(projects => {
      this.projects = projects.map(p => ({
        ...p,
        createdAt: moment(p.createdAt).format('LLL'),
        start: moment(p.start, 'DD/MM/YYYY').format('LL'),
        finish: moment(p.finish, 'DD/MM/YYYY').format('LL'),
      }));
      this.searchProjects = this.projects;
    });
    this.searchValue
      .debounceTime(1)
      .distinctUntilChanged()
      .subscribe((value: string) => {
        this.searchProjects = this.projects.filter(p => _.deburr(p.name).match(new RegExp(value, 'ig')));
      });
    console.log(this.loggedUser);
    console.log(this.projects);
    console.log(this.searchProjects);
  }
  handleDelete(id) {
    this.projectsService.delete(id).subscribe(res => {
      this.projects = this.projects.filter(p => p._id !== id);
      this.searchProjects = this.projects;
    });
  }
  handleEdit(id) {
    this.router.navigate(['/', 'projects', 'edit', id]);
  }
  handleSearch(value) {
    this.searchValue.next(value);
  }

}
