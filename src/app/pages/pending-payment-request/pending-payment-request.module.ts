import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PendingPaymentRequestPageRoutingModule } from './pending-payment-request-routing.module';
import { PendingPaymentRequestPage } from './pending-payment-request.page';
import { RequestComponentModule } from '../../components/request/request.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendingPaymentRequestPageRoutingModule,
    RequestComponentModule
  ],
  declarations: [PendingPaymentRequestPage]
})
export class PendingPaymentRequestPageModule {}
