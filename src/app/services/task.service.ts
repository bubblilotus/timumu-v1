import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { List } from '../models/list';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] = [];
  storage = localStorage;

  constructor(private httpClient: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
      if(JSON.parse(this.storage.getItem("tasks")) != null){
        this.tasks = JSON.parse(this.storage.getItem("tasks"));
      }
  }

  updateStorage() {
    this.storage.setItem('tasks', JSON.stringify(this.tasks));
  }
  get(listId: any): Observable<Task[]> {
    return of(this.tasks.filter(task => task.list.id == listId));
  }

  post(task: Task): Observable<Task[]> {
    task.id = uuid.v4();
    this.tasks.push(task);
    this.updateStorage();
    return of(this.tasks);
  }
  getIndex(taskId){
    return this.tasks.findIndex(task => task.id == taskId);
  }
  update(task: Task): Observable<Task> {
    let editTask = this.tasks[this.getIndex(task.id)];
    editTask = task;
    this.updateStorage();
    return of(editTask);
  }

  delete(taskId: string):Observable<Task[]> {
    this.tasks.splice(this.getIndex(taskId), 1);
    this.updateStorage();
    return of(this.tasks);
  }


}
