import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {
  cards: Array<Card> = [];
  showCards: Array<Card> = [];
  pinnedCards: Array<any> = [];
  unpinnedCardsStart = 0;

  constructor(public snackbar: MatSnackBar) {
    let stroredCards = JSON.parse(localStorage.getItem('cards'));
    if(stroredCards != null){
      this.cards = stroredCards;
    }
    this.showCards = this.cards;
   }

  public create(card: Card){
    this.cards.push(card);
    this.updateLocalStorage();
  }
  updateLocalStorage(){
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }
  update(cardIndex:any, card: Card){
    this.cards[cardIndex] = card;
    this.updateLocalStorage();
  }
  pin(cardIndex: any){
    this.cards[cardIndex].isPinned = true;
    this.moveCard(cardIndex);
    this.unpinnedCardsStart++;
    this.updateLocalStorage();
  }
  unpin(cardIndex:any){
    this.cards[cardIndex].isPinned = false;
    this,this.moveCard(cardIndex);
    this.unpinnedCardsStart = this.unpinnedCardsStart > 0? this.unpinnedCardsStart - 1 : 0;
    this.updateLocalStorage();
  }
  delete(cardIndex: any){
    //option to undo later
    this.snackbar.open("Card deleted.", 'OK')
    this.unpin(cardIndex);
    this.cards.splice(cardIndex, 1);
    this.updateLocalStorage();
  }
  moveCard(cardIndex: any){
    let card = this.cards[cardIndex];
    this.cards.splice(cardIndex, 1);
    if(card.isPinned){
      this.cards.unshift(card);
    }
    else{
      this.cards.splice(this.unpinnedCardsStart-1, 0, card);
    }
    
    this.updateLocalStorage();
  }
  deleteCompleted(cardIndex){
    this.cards[cardIndex].tasks = this.cards[cardIndex].tasks.filter(
      task => task.completed == false
    );
    this.updateLocalStorage();
  }

  // public createBoard(title: string){
  //   let newBoard = {title:title, cards:[], completed: []};
  //   this.boards.push(newBoard);
  //   localStorage.setItem('boards', JSON.stringify(this.boards));
  // }
  // public updateLocalStorage(){
  //   localStorage.setItem('boards', JSON.stringify(this.boards));
  // }

}
export interface Card{
  title: string;
  tasks: Array<Task>;
  isPinned: boolean;
}

export interface Task{
  description: string;
  completed: boolean;
}