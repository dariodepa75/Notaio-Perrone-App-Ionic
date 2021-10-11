import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
  {
    path: 'login',
    loadChildren: () => import('./pages/authentication/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/authentication/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'pending-payment-request',
    loadChildren: () => import('./pages/pending-payment-request/pending-payment-request.module').then( m => m.PendingPaymentRequestPageModule)
  },
  {
    path: 'date-requests',
    loadChildren: () => import('./pages/date-requests/date-requests.module').then( m => m.DateRequestsPageModule)
  },
  {
    path: 'date-request/:id',
    loadChildren: () => import('./pages/detail-date-request/detail-date-request.module').then( m => m.DetailDateRequestPageModule)
  },
  {
    path: 'detail-date-request',
    loadChildren: () => import('./pages/detail-date-request/detail-date-request.module').then( m => m.DetailDateRequestPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
