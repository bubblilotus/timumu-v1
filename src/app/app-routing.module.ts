import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pathToFileURL } from 'url';
import { FoldersComponent } from './components/folders/folders.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {path: "lists/:folder_id", component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
