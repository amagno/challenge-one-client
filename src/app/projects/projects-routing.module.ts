import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectContainerComponent } from './project-container/project-container.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  { path: '', component: ProjectContainerComponent, children: [
    { path: 'all', component: ProjectListComponent },
    { path: 'create', component: ProjectCreateComponent },
    { path: 'edit/:id', component: ProjectCreateComponent },
    { path: '', redirectTo: 'all', pathMatch: 'full' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
