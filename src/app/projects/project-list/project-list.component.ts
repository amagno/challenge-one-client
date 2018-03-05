import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/project.model';
import { ProjectsService } from '../shared/projects.service';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import 'rxjs/add/operator/debounceTime';


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
  constructor(
    private projectsService: ProjectsService
  ) {
    moment.locale('pt-br');
  }

  ngOnInit() {
    this.projectsService.getAll().subscribe(projects => {
      console.log(projects);
      this.projects = projects.map(p => ({
        ...p,
        createdAt: moment(p.createdAt).format('LLL')
      }));
      this.searchProjects = this.projects;
    });
    this.searchValue
      .debounceTime(1)
      .distinctUntilChanged()
      .subscribe((value: string) => {
        this.searchProjects = this.projects.filter(p => p.name.match(buildSearchRegex(value)));
      });
  }
  handleDelete(id) {
    this.projectsService.delete(id).subscribe(res => {
      console.log(res);
      this.projects = this.projects.filter(p => p._id !== id);
    });
  }
  handleSearch(value) {
    this.searchValue.next(value);
  }

}
