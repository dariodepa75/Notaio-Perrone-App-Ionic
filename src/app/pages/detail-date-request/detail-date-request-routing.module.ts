import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailDateRequestPage } from './detail-date-request.page';

const routes: Routes = [
  {
    path: '',
    component: DetailDateRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailDateRequestPageRoutingModule {}
