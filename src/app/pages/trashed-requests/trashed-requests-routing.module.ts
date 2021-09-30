import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrashedRequestsPage } from './trashed-requests.page';

const routes: Routes = [
  {
    path: '',
    component: TrashedRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashedRequestsPageRoutingModule {}
