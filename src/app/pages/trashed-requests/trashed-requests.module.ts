import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrashedRequestsPageRoutingModule } from './trashed-requests-routing.module';
import { TrashedRequestsPage } from './trashed-requests.page';
import { RequestComponentModule } from '../../components/request/request.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrashedRequestsPageRoutingModule,
    RequestComponentModule
  ],
  declarations: [TrashedRequestsPage]
})
export class TrashedRequestsPageModule {}
