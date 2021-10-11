import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailDateRequestPageRoutingModule } from './detail-date-request-routing.module';

import { DetailDateRequestPage } from './detail-date-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailDateRequestPageRoutingModule
  ],
  declarations: [DetailDateRequestPage]
})
export class DetailDateRequestPageModule {}
