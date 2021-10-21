import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestQuotePage } from './request-quote.page';

const routes: Routes = [
  {
    path: '',
    component: RequestQuotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestQuotePageRoutingModule {}
