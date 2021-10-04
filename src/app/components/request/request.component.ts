import { Component, OnInit, Input } from '@angular/core';
import { RequestModel } from '../../models/request';
import { RequestManagerService } from '../../services/request-manager.service';
import { AuthenticationService } from '../../services/authentication.service';

import * as moment from 'moment';
import { STATUS_0, STATUS_100, STATUS_200, STATUS_300 } from '../../utils/constants';


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})

export class RequestComponent implements OnInit {
  // input / output
  @Input() request: RequestModel;

  public dateRequest: string;
  public timeRequest: string;

  STATUS_0 = STATUS_0; // in attesa di risposta
  STATUS_100 = STATUS_100; // in attesa di pagamento
  STATUS_200 = STATUS_200; // in attesa di consulenza
  STATUS_300 = STATUS_300; // consulenza conclusa

  constructor(
    public requestManagerService: RequestManagerService,
    public authenticationService: AuthenticationService
  ) { 
  }

  ngOnInit() {
    this.formatDate();
    //this.checkRequestStatus();
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  formatDate(){
    moment.locale('it');
    var  d = new Date(this.request.time); 
    this.dateRequest = moment(d).format("D MMM YY");
    this.timeRequest = moment(d).format("HH:mm");
    console.log('curr_date:', this.timeRequest);
  }

  /** */
  requestToBeArchived(item){
    console.log('requestToBeArchived:', item);
    item.close();
    this.requestManagerService.requestToBeArchived(item, this.request);
  }

  /** */
  requestToBePrevious(item){
    console.log('requestToBePrevious:', item);
    item.close();
    this.requestManagerService.requestToBePrevious(item, this.request);
  }

  /** */
  requestToBeTrashed(item){
    console.log('requestToBeTrashed:', item);
    item.close();
    this.requestManagerService.requestToBeTrashed(item, this.request);
  }

  /** */
  requestToBeRestored(item){
    console.log('requestToBeRestored:', item);
    item.close();
    this.requestManagerService.requestToBeRestored(item, this.request);
  }
  

}
