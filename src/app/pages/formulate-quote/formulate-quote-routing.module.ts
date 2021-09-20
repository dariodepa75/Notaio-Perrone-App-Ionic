import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormulateQuotePage } from './formulate-quote.page';

const routes: Routes = [
  {
    path: '',
    component: FormulateQuotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormulateQuotePageRoutingModule {}
