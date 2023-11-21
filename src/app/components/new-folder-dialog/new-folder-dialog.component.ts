import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Folder } from 'src/app/models/folder';
import { List } from 'src/app/models/list';
import { NewItemType } from 'src/app/models/new-item-type';
import { FolderService } from 'src/app/services/folder.service';
import { ListService } from 'src/app/services/list.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.css']
})
export class NewFolderDialogComponent implements OnInit {
  newItemType: string;
  dialogForm: FormGroup;
  nameControl: FormControl;
  editMode: boolean;
  item: any;
  folderId: any;
  constructor(private folderService: FolderService,
    private listService: ListService,
    public dialogRef: MatDialogRef<NewFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.editMode = !this.data.new;
    this.newItemType = this.data.newItemType.toLowerCase();
    this.item = this.data.item;
    this.nameControl = new FormControl
      ('', [Validators.required, FormValidators.notOnlyWhiteSpace]);
    if (this.editMode) {
      this.nameControl.setValue(this.data.item.name);
    }
    if(this.data.folderId){
      this.folderId = this.data.folderId;
    }
  }
  submit(){
    let value = this.nameControl.value.trim();
    if(this.editMode){
      this.rename(value);
    }else{
      this.add(value);
    }
    this.close();
    this.confirmAction(value);
  }
  // rename methods
  rename(value: string){
    if(this.newItemType == 'folder'){
      this.renameFolder(value);
    }
    else{
      this.renameList(value);
    }
  }
  renameFolder(name: string) {
    let folder: Folder = this.item;
    this.folderService.updateName(folder, name).subscribe(
      this.reload());
  }
  renameList(name: string) {
    let list: List = this.data.item;
    this.listService.updateName(list, name).subscribe(
      this.reload()
    );
  }
  //reload folders/lists
  reload() {
    return {
      next: (response: any) => {
        console.log(response);
        if(this.newItemType == 'folder'){
          this.folderService.changeId(response.id);
        }
        else{
          this.listService.changeId(response.id);
        }
        
      },
      error: err => {
        console.log(err);
      }
    }
  }
  //add methods
  addFolder(name: string){
    this.folderService.post(name).subscribe(
      this.reload()
    );
  }
  addList(name: string){
    console.log(this.folderId);
    this.listService.postList(name, this.folderId).subscribe(
      this.reload()
    );
  }
  add(value: string) {
    if (this.newItemType == 'folder') {
      this.addFolder(value);
    }
    else{
      this.addList(value);
    }
  }
  confirmAction(value: string) {
    const message = `${this.newItemType} '${value}' 
    ${this.data.new ? 'added' : 'renamed'}.`
    this.folderService.openSnackBar(message, 'ok');
  }
  close() {
    this.dialogRef.close();
  }

}
