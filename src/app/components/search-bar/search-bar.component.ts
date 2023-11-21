import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Card, CardServiceService } from 'src/app/services/card-service.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  myControl = new FormControl('');
  titles: string[] = this.cardService.cards.map(card => card.title);
  // tasks: string []= [].concat(...this.cardService.cards.map(card => card.tasks.map(task => task.description)));
  // titlesAndTasks: string[] = this.titles.concat(this.tasks);
  filteredCards: Observable<Card[]>;

  constructor(public cardService: CardServiceService) { }

  ngOnInit(): void {
    this.filteredCards = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      
    );
    this.filteredCards.subscribe((filteredCards) => {
      console.log(filteredCards as Card[]);
      this.cardService.showCards = filteredCards as Card[];
      console.log(this.cardService.showCards);
    });
    
  }

  private _filter(value: string): Card[] {
    let filterValue = value.toLowerCase();
    return this.cardService.cards.filter(card => card.title.toLowerCase().includes(filterValue));
  }

}
