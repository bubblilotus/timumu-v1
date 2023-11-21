import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardServiceService } from 'src/app/services/card-service.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent implements OnInit {

  cardIndex: any
  constructor(public cardService: CardServiceService, public dialogRef: MatDialogRef<WarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this.cardIndex = this.data.cardIndex;
  }
  delete(){
    this.cardService.delete(this.cardIndex);
    this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }

}
