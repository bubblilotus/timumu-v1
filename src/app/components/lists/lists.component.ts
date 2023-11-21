import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { List } from 'src/app/models/list';
import { NewItemType } from 'src/app/models/new-item-type';
import { FolderService } from 'src/app/services/folder.service';
import { NewFolderDialogComponent } from '../new-folder-dialog/new-folder-dialog.component';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  lists: List[] = [];
  folderId: any;
  currentListId: any;
  constructor(private folderService: FolderService,
    private listService: ListService, 
    private route: ActivatedRoute, private router: Router, 
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.folderService.folderIdEmitter.subscribe(
      (data) => {
        this.folderId = data;
        if(this.folderId != null){
          this.getList();
        }
        else{
          this.lists = [];
          this.listService.changeId(null);
        }
        
      }
    );
    this.listService.listIdEmitter.subscribe(
      (data) => {
        this.currentListId = data;
          this.getList();
      }
    );
    
  }
  selectList(listId: any){
    this.listService.changeId(listId);
  }
  getList(){
   this.listService.get(this.folderId).subscribe(
        (data) => {
          this.lists = data;
        }
      );


      //one to
    
  }
  newList(){
    if(this.folderId != null){
      this.listService.openNewFolderDialog(this.folderId);
    }else{
      this.folderService.openSnackBar("please select a folder first.", 'ok');
    }
  }
  delete(list: List){
    this.listService.delete(list.id).subscribe(
      () => {
        this.getList();
        this.listService.changeId(null);
      }
    );
  }
  
 

}
