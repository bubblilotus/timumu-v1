import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';
import { Task } from 'src/app/models/task';
import { FolderService } from 'src/app/services/folder.service';
import { ListService } from 'src/app/services/list.service';
import { TaskService } from 'src/app/services/task.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  showInput: boolean;
  taskInput: FormControl;
  tasks: Task[] = [];
  listId: string;
  editMode: boolean;
  taskToEdit: Task;
  currentList: List;

  constructor(private folderService: FolderService,
    private listService: ListService,
    private taskSerivce: TaskService) {
    this.taskInput = new FormControl('', [Validators.required, FormValidators.notOnlyWhiteSpace]);
  }

  ngOnInit(): void {
    this.showInput = false;
    this.editMode = false;
    this.taskToEdit = new Task();
    this.listService.listIdEmitter.subscribe(
      (data) => {
        this.listId = data;
        if(this.listId != null){
          this.listId = data;
          this.getTasks(this.listId);
          this.showInput = false;
        }
        
      }
    );

  }
  getTasks(listId: any) {
    this.taskSerivce.get(listId).subscribe(
      (data) => {
        this.tasks = data;
      }
    );
  }
  toggleCompleted(task: Task) {
    task.completed = !task.completed;
    this.taskSerivce.update(task).subscribe(
      this.updateList()
    );
  }
  toggleShowTaskInput() {
    this.showInput = !this.showInput;
  }
  addTask() {
    if (this.taskInput.valid) {
      let newTask = new Task();
      newTask.name = this.taskInput.value.trim();
      newTask.list = new List();
      newTask.list.id = this.listId;
      this.taskSerivce.post(newTask).subscribe(
        this.updateList()
      );
    }
    this.taskInput.reset();
  }
  updateList(){
return {
  next: () => {
  this.getTasks(this.listId);
},
error: (err) => {
  console.log(err);
}
}
  }
  closeTask() {
    this.taskInput.reset();
    this.editMode = false;
    this.showInput = false;
  }
  editTask(task: Task) {
    this.showInput = true;
    this.editMode = true;
    this.taskToEdit = task;
    this.taskInput.setValue(task.name);
  }
  updateTask() {
    if (this.taskInput.valid) {
      this.taskToEdit.name = this.taskInput.value.trim();
      this.taskSerivce.update(this.taskToEdit).subscribe(
        this.updateList()
      );
    }
    this.closeTask();
  }
  deleteTask(task: Task) {
    this.taskSerivce.delete(task.id).subscribe(
      this.updateList()
    );
  }

}
