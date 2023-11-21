import { Component, ElementRef, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCardDialogComponent } from 'src/app/components/new-card-dialog/new-card-dialog.component';
import { NewCardComponent } from 'src/app/components/new-card/new-card.component';
import { WarningComponent } from 'src/app/components/warning/warning.component';
import { Card, CardServiceService } from 'src/app/services/card-service.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit, OnDestroy{
  tasks: Array<Task> = [{description: "task1", completed: true}, 
  {description: "task2", completed: false}, {description: "task3", completed: true}];

  pinnedCards: Array<any> = [1, 2, 4, 5];
  cards: Array<Card>;

  constructor(public dialog: MatDialog, public cardService: CardServiceService) { }

  ngOnInit(): void {
    this.cards = this.cardService.showCards;
  }
  onPin(cardIndex: any){
    this.cardService.pin(cardIndex);
  }
  onUnpin(cardIndex: any){
    this.cardService.unpin(cardIndex);
  }
  onDelete(cardIndex: any){
    this.dialog.open(WarningComponent, {
      data:{
        cardIndex: cardIndex
      }
    });
    //this.cardService.delete(cardIndex);
  }
  onDeleteCompleted(cardIndex: any){
    this.cardService.deleteCompleted(cardIndex);
  }
  openEditCardDialog(cardIndex: any){
    this.dialog.open(NewCardComponent, {
      width: '60%',
      height: '90vh',
      data: {
        new: false,
        cardIndex: cardIndex
      }
    });
  }

  openNewCardDialog(){
    this.dialog.open(NewCardComponent, {
      width: '60%',
      height: '90vh',
      data: {
        new: true
      }
    });
  }
  
  toggleCompleted(cardIndex: any, taskIndex: any){
    this.cards[cardIndex].tasks[taskIndex].completed = !this.cards[cardIndex].tasks[taskIndex].completed;
  }
  isPinned(cardIndex: any){
    return this.pinnedCards.includes(cardIndex);
  }
  togglePinnedArray(cardIndex: any){
    let pinIndex = this.pinnedCards.indexOf(cardIndex);
    console.log(pinIndex);
    if(pinIndex > -1){
      this.pinnedCards.splice(pinIndex, 1);
    }
    else{
      this.pinnedCards.push(cardIndex);
    }
  }
  movePinnedFront(taskIndex: any){
    let pinnedTask:Task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);
    this.tasks.unshift(pinnedTask);
  }

  ngOnDestroy(){
    this.cardService.updateLocalStorage();
  }

}
export interface Task{
  description: string;
  completed: boolean;
}
