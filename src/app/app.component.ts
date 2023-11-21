import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'timumu_angular';
    
  /*------------------------------------------
  --------------------------------------------
  Defined constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
        
      ) {
      
  }

}
