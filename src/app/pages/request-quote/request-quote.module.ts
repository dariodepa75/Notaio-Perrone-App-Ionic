import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestQuotePageRoutingModule } from './request-quote-routing.module';

import { RequestQuotePage } from './request-quote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestQuotePageRoutingModule
  ],
  declarations: [RequestQuotePage]
})
export class RequestQuotePageModule {}
