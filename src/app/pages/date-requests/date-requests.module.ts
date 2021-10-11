import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DateRequestsPageRoutingModule } from './date-requests-routing.module';
import { DateRequestsPage } from './date-requests.page';
import { DateRequestComponentModule } from '../../components/date-request/date-request.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DateRequestsPageRoutingModule, 
    DateRequestComponentModule
  ],
  declarations: [DateRequestsPage]
})
export class DateRequestsPageModule {}
