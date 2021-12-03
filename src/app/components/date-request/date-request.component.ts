import { Component, OnInit, Input } from '@angular/core';
import { DateRequestModel } from '../../models/date-request';
import { DateRequestManagerService } from '../../services/date-request-manager.service';
import { AuthenticationService } from '../../services/authentication.service';

import * as moment from 'moment';
import { STATUS_0, STATUS_100, STATUS_200, STATUS_300 } from '../../utils/constants';

@Component({
  selector: 'app-date-request',
  templateUrl: './date-request.component.html',
  styleUrls: ['./date-request.component.scss'],
})

export class DateRequestsComponent implements OnInit {
  // input / output
  @Input() request: DateRequestModel;

  public dateRequest: string;
  public timeRequest: string;
  public labelDateRequest: string;

  STATUS_0 = STATUS_0; // in attesa di risposta
  STATUS_100 = STATUS_100; // in attesa di pagamento
  STATUS_200 = STATUS_200; // in attesa di consulenza
  STATUS_300 = STATUS_300; // consulenza conclusa

  constructor(
    public dateRequestManagerService: DateRequestManagerService,
    public authenticationService: AuthenticationService
  ) { 
  }

  /** */
  ngOnInit() {
    this.formatDate();
    this.formatLabelDateRequest();
    //this.checkRequestStatus();
  }

  /** */
  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  /** */
  formatDate(){
    moment.locale('it');
    //var  d = new Date(this.request.time); 
    var startDate = moment(this.request.time, 'YYYY-MM-DDThh:mmZ');
    this.dateRequest = moment(startDate).format("D MMM YY");
    this.timeRequest = moment(startDate).format("HH:mm");
    console.log('curr_date:', this.request.time, startDate, this.dateRequest, this.timeRequest);
  }

  formatLabelDateRequest(){
    moment.locale('it');
    //var  d = new Date(this.request.data_desiderata); 
    var startDate = moment(this.request.data_desiderata, 'YYYY-MM-DDThh:mmZ');
    let dateRequest = moment(startDate).format("D MMM YY");
    //this.timeRequest = moment(d).format("HH:mm");
    console.log('curr_date:', this.request.data_desiderata, startDate, this.dateRequest);
    this.labelDateRequest =  'Richiesta appuntamento per il '+dateRequest+' alle '+ this.request.ora_desiderata;
  }


  /** */
  requestToBeArchived(item){
    console.log('requestToBeArchived:', item);
    item.close();
    this.dateRequestManagerService.requestToBeArchived(item, this.request);
  }

  /** */
  requestToBePrevious(item){
    console.log('requestToBePrevious:', item);
    item.close();
    this.dateRequestManagerService.requestToBePrevious(item, this.request);
  }

  /** */
  requestToBeTrashed(item){
    console.log('requestToBeTrashed:', item);
    item.close();
    this.dateRequestManagerService.requestToBeTrashed(item, this.request);
  }

  /** */
  requestToBeRestored(item){
    console.log('requestToBeRestored:', item);
    item.close();
    this.dateRequestManagerService.requestToBeRestored(item, this.request);
  }
  

}
