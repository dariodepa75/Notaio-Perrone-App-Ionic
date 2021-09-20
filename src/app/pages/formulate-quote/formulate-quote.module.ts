import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormulateQuotePageRoutingModule } from './formulate-quote-routing.module';

import { FormulateQuotePage } from './formulate-quote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormulateQuotePageRoutingModule
  ],
  declarations: [FormulateQuotePage]
})
export class FormulateQuotePageModule {}
