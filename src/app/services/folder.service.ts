import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../models/folder';
import { environment } from 'src/environments/environment';
import { Observable, Subject, map } from 'rxjs';
import { List } from '../models/list';
import { Task } from '../models/task';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../components/new-folder-dialog/new-folder-dialog.component';
import { NewItemType } from '../models/new-item-type';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EventEmitter } from 'stream';
import { of } from 'rxjs';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class FolderService {
  
  folders: Folder[] = [];
  storage = localStorage;
  folderIdEmitter: Subject<string> = new Subject<string>();

  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { 
                if(JSON.parse(this.storage.getItem("folders")) != null){
                  this.folders = JSON.parse(this.storage.getItem("folders"));
                }
                
              }

  updateStorage(){
    this.storage.setItem('folders', JSON.stringify(this.folders));
  }
  get(): Observable<Folder[]> {
    return of(this.folders);
  }
  
  updateName(folder: Folder, name: string):Observable<Folder> {
    let editFolder = this.folders[this.getIndex(folder.id)];
    editFolder.name = name;
    this.updateStorage();
    return of(editFolder);
  }
  getIndex(folderId){
    return this.folders.findIndex(folder => folder.id == folderId);
  }
  delete(folderId: string):Observable<Folder[]> {
    this.folders.splice(this.getIndex(folderId), 1);
    this.updateStorage();
    return of(this.folders);
  }
  
  post(name: string): Observable<Folder[]> {
    let folder = new Folder();
    folder.name = name;
    folder.id = this.generateId();
    this.folders.push(folder);
    this.updateStorage();
    return of(this.folders);
  }

  changeId(folderId: any) {
    this.folderIdEmitter.next(folderId);
  }

  openNewFolderDialog() {
    this.dialog.open(NewFolderDialogComponent, {
      width: '40%',
      height: '40vh',
      panelClass: 'my-panel-class',
      data: {
        new: true,
        newItemType: NewItemType.FOLDER,
        folderId: null
      }
    });
  }
    
  openSnackBar(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar-class'];
    config.duration = 5000;
    this.snackBar.open(message, action, config);
  }
  generateId(){
    return uuid.v4();
  }

}
interface getFolderResponse {
  _embedded: {
    folders: Folder[]
  }
}
interface getListResponse {
  _embedded: {
    lists: List[]
  }
}
interface getTaskResponse {
  _embedded: {
    tasks: Task[]
  }
}
