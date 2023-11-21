import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewItemType } from 'src/app/models/new-item-type';
import { NewFolderDialogComponent } from '../new-folder-dialog/new-folder-dialog.component';
import { FolderService } from 'src/app/services/folder.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-vert-menu',
  templateUrl: './vert-menu.component.html',
  styleUrls: ['./vert-menu.component.css']
})
export class VertMenuComponent implements OnInit {
   @Input() itemType: string;
   @Input() editedItem: any;
  constructor(private dialog: MatDialog,
    private folderService: FolderService,
    private listService: ListService,
    private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }
  openRenameDialog(){
    this.dialog.open(NewFolderDialogComponent, {
      width: '40%',
      height: '40vh',
      panelClass: 'my-panel-class',
      data: {
        new: false,
        newItemType: this.itemType,
        item: this.editedItem
      }
    });
  }
  deleteCompleted(){
    // if(this.editedItem != null){
    //   this.listService.deleteCompletedTasks(this.editedItem.id).subscribe(
    //     ()=>{
    //       this.listService.changeId(this.editedItem.id)
    //     }
    //   );
    // }
  }
  delete(){
    if(this.itemType == 'folder'){
      //delete folder
      console.log(this.editedItem.id);
      this.folderService.delete(this.editedItem.id).subscribe(
        this.reload(true)
      );
    }
    else{
      //delete list
      this.listService.delete(this.editedItem.id).subscribe(
        this.reload(true)
      );
    }
    let message = `${this.itemType} 
    ${this.editedItem.name} has been deleted`;
    this.folderService.openSnackBar(message, "undo");
  }
  reload(deleted: boolean) {
    let next;
    return {
      next: (response: any) => {
        next = deleted? null: response.id;
        console.log(response);
        if(this.itemType == 'folder'){
          this.folderService.changeId(next);
        }
        else{
          this.listService.changeId(next);
        }
        
      },
      error: err => {
        console.log(err);
      }
    }
  }

}
