import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
 
  {
    path: 'request/:id',
    loadChildren: () => import('./pages/view-message/view-message.module').then( m => m.ViewMessagePageModule)
  },
  {
    path: 'formulate-quote',
    loadChildren: () => import('./pages/formulate-quote/formulate-quote.module').then( m => m.FormulateQuotePageModule)
  },
  {
    path: 'archived',
    loadChildren: () => import('./pages/archived-requests/archived-requests.module').then( m => m.ArchivedRequestsPageModule)
  },
  {
    path: 'trashed',
    loadChildren: () => import('./pages/trashed-requests/trashed-requests.module').then( m => m.TrashedRequestsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
