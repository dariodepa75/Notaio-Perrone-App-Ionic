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



}
