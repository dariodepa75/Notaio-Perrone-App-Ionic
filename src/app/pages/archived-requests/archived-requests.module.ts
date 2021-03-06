import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivedRequestsPageRoutingModule } from './archived-requests-routing.module';
import { ArchivedRequestsPage } from './archived-requests.page';
import { RequestComponentModule } from '../../components/request/request.module';
import { DateRequestComponentModule } from '../../components/date-request/date-request.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivedRequestsPageRoutingModule,
    RequestComponentModule,
    DateRequestComponentModule
  ],
  declarations: [ArchivedRequestsPage]
})
export class ArchivedRequestsPageModule {}
