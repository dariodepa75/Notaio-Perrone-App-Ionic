import { Component, OnInit, Input } from '@angular/core';
import { RequestModel } from '../../models/request';
import * as moment from 'moment';


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})

export class RequestComponent implements OnInit {
  @Input() request: RequestModel;

  public dateRequest: string;
  public timeRequest: string;

  
  constructor() { 
  }

  ngOnInit() {
    this.formatDate();
    this.checkRequestStatus();
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


  checkRequestStatus(){
    switch(this.request.status) { 
      case '0': { 
        this.request.chr_status = 'R';
        this.request.msg_status = "IN ATTESA DI RISPOSTA";
         break; 
      } 
      case '1': { 
        this.request.chr_status = 'C';
        this.request.msg_status = "IN ATTESA DI CONSULENZA";
         break; 
      } 
      default: { 
        this.request.chr_status = 'F';
        this.request.msg_status = "CONSULENZA CONCLUSA";
         break; 
      } 
    } 
  }

}
