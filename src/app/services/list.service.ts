import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { List } from '../models/list';
import { get } from 'http';
import { Folder } from '../models/folder';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewItemType } from '../models/new-item-type';
import { NewFolderDialogComponent } from '../components/new-folder-dialog/new-folder-dialog.component';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class ListService {

  lists: List[] = [];
  storage = localStorage;

  listIdEmitter: Subject<string> = new Subject<string>();

  constructor(private httpClient: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) {
      if(JSON.parse(this.storage.getItem("lists")) != null){
        this.lists = JSON.parse(this.storage.getItem("lists"));
      }
  }
  updateStorage() {
    this.storage.setItem('lists', JSON.stringify(this.lists));
  }
  get(folderId: any): Observable<List[]> {
    return of(this.lists.filter(list => list.folder.id == folderId));
  }
  updateName(list: List, name: string): Observable<List> {
    let editList = this.lists[this.getIndex(list.id)];
    editList.name = name;
    this.updateStorage();
    return of(editList);
  }
  getIndex(listId){
    return this.lists.findIndex(list => list.id == listId);
  }
  postList(name: string, folderId): Observable<List> {
    let list = this.createNew(name, folderId);
    this.lists.push(list);
    this.updateStorage();
    return of(list);  
  }
  createNew(name: string, folderId: string): List {
    let newList = new List();
    newList.name = name;
    newList.id = uuid.v4();
    newList.folder = new Folder();
    newList.folder.id = folderId;
    return newList;
  }

  delete(listId: string):Observable<List[]> {
    this.lists.splice(this.getIndex(listId), 1);
    this.updateStorage();
    return of(this.lists)
  }

  // deleteCompletedTasks(listId: string) {
  //   const listUrl = `${this.baseUrl}/lists/deleteCompletedTasks/${listId}`;
  //   return this.httpClient.delete(listUrl);
  // }

  changeId(listId: any) {
    this.listIdEmitter.next(listId);
  }
  openNewFolderDialog(folderId: any) {
    this.dialog.open(NewFolderDialogComponent, {
      width: '40%',
      height: '40vh',
      panelClass: 'my-panel-class',
      data: {
        new: true,
        newItemType: NewItemType.LIST,
        folderId: folderId
      }
    });
  }

}
