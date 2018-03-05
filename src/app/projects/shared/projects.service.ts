import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from './project.model';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:3000/api';

@Injectable()
export class ProjectsService {

  constructor(
    private http: HttpClient
  ) { }
  public getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_URL}/projects`);
  }
  public create(project: Project): Observable<Project> {
    return this.http.post<Project>(`${API_URL}/projects`, project);
  }
  public delete(id): Observable<any> {
    return this.http.delete<any>(`${API_URL}/projects/${id}`);
  }
  public getById(id): Observable<Project> {
    return this.http.get<Project>(`${API_URL}/projects/${id}`);
  }
  public edit(id: string, data: Project): Observable<any> {
    return this.http.put<any>(`${API_URL}/projects/${id}`, data);
  }

}
