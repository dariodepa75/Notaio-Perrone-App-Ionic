import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
// import { MessageComponentModule } from '../../components/message/message.module';
import { RequestComponentModule } from '../../components/request/request.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // MessageComponentModule,
    RequestComponentModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
