import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendingPaymentRequestPage } from './pending-payment-request.page';

const routes: Routes = [
  {
    path: '',
    component: PendingPaymentRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingPaymentRequestPageRoutingModule {}
