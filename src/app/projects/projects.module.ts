import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectContainerComponent } from './project-container/project-container.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { StylesModule } from '../shared/styles.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../users/shared/users.service';
import { ProjectsService } from './shared/projects.service';

@NgModule({
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    ReactiveFormsModule,
    StylesModule
  ],
  declarations: [
    ProjectListComponent,
    ProjectContainerComponent,
    ProjectCreateComponent
  ],
  providers: [
    UsersService,
    ProjectsService
  ]
})
export class ProjectsModule { }
