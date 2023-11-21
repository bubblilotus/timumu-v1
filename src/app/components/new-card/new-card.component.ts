import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewCardDialogComponent } from '../new-card-dialog/new-card-dialog.component';
import { Inject } from '@angular/core';
import { Card, CardServiceService, Task } from 'src/app/services/card-service.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css']
})
export class NewCardComponent implements OnInit {

  card: Card = {
    title: '',
    tasks: [{
      description: '',
      completed: false
    }],
    isPinned: false
  }

  cardTitle: string;
  tasks: Array<Task> = [{ description: '', completed: false }];
  inputEmpty: boolean;
  lastRow: any = 0;

  constructor(public dialogRef: MatDialogRef<NewCardComponent>,
    public cardService: CardServiceService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    if(!this.data.new){
      let cardIndex = this.data.cardIndex;
      this.cardTitle = this.cardService.cards[cardIndex].title;
      this.tasks = this.cardService.cards[cardIndex].tasks;
      this.lastRow = this.tasks.length - 1;
      this.addRow();

    }
    console.log(this.cardService.cards);
    this.do();
  }

  onEnter(taskIndex: any) {
    if (!this.isWhiteSpace(taskIndex)) {
      if (taskIndex == this.lastRow - 1) {
        //focus on last row
      }
      else {
        this.addRow(taskIndex);
        //focus on next row
      }
    }
  }
  onKeypress(taskIndex: any) {
    if (!this.isWhiteSpace(taskIndex)) {
      if (taskIndex == this.lastRow) {
        this.addRow(taskIndex);
        //focus on next row
      }
    }
  }
  addRow(taskIndex?: any) {
    let emptyTask: Task = { description: '', completed: false };
    if (taskIndex != undefined) {
      this.tasks.splice(taskIndex + 1, 0, emptyTask);
    }
    else {
      this.tasks.push(emptyTask);
    }
    this.lastRow ++;
    console.log(this.lastRow);
  }
  isWhiteSpace(taskIndex: any) {
    return this.tasks[taskIndex].description.trim().length == 0;
  }


  removeEmptyTaskDescriptions() {
    console.log("removing empty");
    this.tasks = this.tasks.filter((task) => task.description != '');
  }
  editCard(){
  }


  do() {
    this.dialogRef.beforeClosed().subscribe(
      () => {
        this.removeEmptyTaskDescriptions();
        let newCard: Card = {
          title: this.cardTitle,
          tasks: this.tasks,
          isPinned: false
        }
        if(this.data.new && (this.tasks.length > 0 || this.cardTitle.trim().length > 0)){
          
          
          this.cardService.create(newCard);
        }
        else{
          this.cardService.update(this.data.cardIndex, newCard);
        }
        
          
        

        console.log(this.cardService.cards);
      }
    );
  }

  deleteTask(taskIndex: any) {
    this.tasks.splice(taskIndex, 1);
  }
  addList(newTasks: Array<Task>) {
    this.tasks = this.tasks.concat(newTasks);
  }
  addRowOnDirty(taskIndex: any) {
    if (this.lastRow != taskIndex) {
      if (this.tasks[taskIndex].description.length == 1) {
        this.addRow();
        this.lastRow++;
      }
      // this.lastRow = taskIndex;
    }
  }
  // onEnter(taskIndex: any){
  //   this.addRowOnDirty(taskIndex);
  // }

  trimInput(taskIndex: any) {
    this.tasks[taskIndex].description = this.tasks[taskIndex].description.trim();
  }
  isInputEmpty(taskIndex) {
    this.trimInput(taskIndex);
    return this.tasks[taskIndex].description;
  }
  formatToStringArray(pastedText: any) {
    let stringArray = pastedText.split("\n");
    let lastString = stringArray.pop();
    stringArray = stringArray.map(string => string.slice(0, -1));
    stringArray.push(lastString);
    return stringArray;
  }
  onPaste(event: ClipboardEvent) {
    let pastedText = event.clipboardData.getData("text");
    let taskDescritions: Array<string> = this.formatToStringArray(pastedText);
    let newTasksArray = this.stringArrayToTaskArray(taskDescritions);
    this.tasks.pop();
    this.addList(newTasksArray);
    console.log(this.tasks);
  }
  stringArrayToTaskArray(taskDescritions: any) {
    let tasksArray: Array<Task> = taskDescritions.map(taskDescrition => {
      return { 'description': taskDescrition, 'completed': false }
    });
    return tasksArray;
  }


}






