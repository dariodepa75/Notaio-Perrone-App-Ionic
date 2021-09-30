import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivedRequestsPage } from './archived-requests.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivedRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivedRequestsPageRoutingModule {}
