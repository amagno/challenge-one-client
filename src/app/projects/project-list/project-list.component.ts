import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project.model';
import { ProjectsService } from '../shared/projects.service';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import 'rxjs/add/operator/debounceTime';
import * as _ from 'lodash';
import { AuthService } from '../../core/auth.service';
import { User } from '../../users/shared/user.model';


const buildSearchRegex = (str = ''): RegExp => {
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
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];
  searchProjects: Project[];
  searchValue = new Subject();
  loggedUser: User;
  constructor(
    private projectsService: ProjectsService,
    private auth: AuthService,
  ) {
    moment.locale('pt-br');
  }

  ngOnInit() {
    this.projectsService.getAll().subscribe(projects => {
      console.log(projects);
      this.projects = projects.map(p => ({
        ...p,
        createdAt: moment(p.createdAt).format('LLL'),
        start: moment(p.start, 'DD/MM/YYYY').format('LL'),
        finish: moment(p.finish, 'DD/MM/YYYY').format('LL'),
      }));
      this.searchProjects = _.orderBy(this.projects, ['name'], ['asc']);
    });
    this.searchValue
      .debounceTime(1)
      .distinctUntilChanged()
      .subscribe((value: string) => {
        const result = this.projects.filter(p => p.name.match(buildSearchRegex(value)));
        this.searchProjects = _.orderBy(result, ['name'], ['asc']);
      });
    this.loggedUser = this.auth.getUser();
  }
  handleDelete(id) {
    this.projectsService.delete(id).subscribe(res => {
      console.log(res);
      this.projects = this.projects.filter(p => p._id !== id);
      this.searchProjects = _.orderBy(this.projects, ['name'], ['asc']);
    });
  }
  handleSearch(value) {
    this.searchValue.next(value);
  }

}
