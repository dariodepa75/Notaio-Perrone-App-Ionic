import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

import * as moment from 'moment';

import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import {
  STATUS_0, 
  STATUS_100, 
  STATUS_ERROR,
  MSG_FORMULATE_QUOTE,
  TIME_MINUTES_APPOINTMENT
} from '../../utils/constants';
import { formatFromDateToString, addTimeToDate, creationDate, formatDate } from '../../utils/utils';

@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.page.html',
  styleUrls: ['./detail-request.page.scss'],
})
export class DetailRequestPage implements OnInit {
  @ViewChild('datetimeDate') sDate;
  @ViewChild('datetimeTime') sTime;

  public request: RequestModel;
  public key: string;
  public modalDataResponse: any;
  public btnPreventivo: string;
  private subscriptions = [];
  public day: string;
  public numberDay: string;
  public month: string;
  public year: string;
  public timeRequest: string;
  public stringOraDesiderata: string;
  public msgTime: string;
  public msgDate: string;
  public dateDate: any;
  public dateTime: any;

  STATUS_ERROR = STATUS_ERROR;
  STATUS_0 = STATUS_0; // in attesa di risposta
  STATUS_100 = STATUS_100; // in attesa di pagamento
  MSG_FORMULATE_QUOTE = MSG_FORMULATE_QUOTE;

  // ion-datetime config ------------- //
  public ionDatetime: string;
  public datetimeDisplayFormat: string;
  public datetimePickerFormat: string;
  public datetimeDisplayTimezone: string;
  // public datetimeDayShortNames: (string)[];
  public dateMonthShortNames: (string)[];
  public datetimeToday: string;
  public datetimeEndDate: string;
  public datetimeMinuteValues: string;
  public datetimeDoneText: string;
  public datetimeCancelText: string;
  customPickerOptions: any; 
  // ---------------------------------- //


  constructor(
    private requestManagerService : RequestManagerService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public router: Router
  ) { }

  /** */
  ngOnInit() {
    this.key = this.activatedRoute.snapshot.paramMap.get('id');
    this.initSubscriptions();
    //this.requestManagerService.getRequestById(this.key);
  }

  /** */
  // ngAfterViewInit(){
  //   this.btnPreventivo = "Formula preventivo";
  //   console.log('getRequestsById: ' + this.key);
  //   this.requestManagerService.getRequestById(this.key);
  // }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.requestManagerService.getRequestById(this.key);
  }

  /** */
  ngOnDestroy() {
    console.log('UserPresenceComponent - ngOnDestroy');
    this.unsubescribeAll();
  }

  /** */
  private initSubscriptions() {
    let subscribtionKey = '';
    let subscribtion: any;
    const that = this;

    /** BSGetEmailTemplates */
    subscribtionKey = 'BSRequestByID';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSRequestByID.subscribe((data: any) => {
        console.log('***** BSRequestByID *****', JSON.stringify(data));
        if (data != null && data) {
          that.request = data;
          if(!that.request.ora_desiderata || that.request.ora_desiderata == undefined){
            that.request.ora_desiderata = null;
            that.msgTime = 'Ora non specificata';
          } else {
            that.stringOraDesiderata = that.setDate(that.request.data_desiderata, that.request.ora_desiderata, 'hour');
          }
          if(!that.request.data_desiderata || that.request.data_desiderata == undefined){
            that.request.data_desiderata = null;
            that.msgDate = 'Data non specificata';
          } else {
            that.day = that.setDate(that.request.data_desiderata, that.request.ora_desiderata, 'day');
            that.numberDay = that.setDate(that.request.data_desiderata, that.request.ora_desiderata, 'numberDay');
            that.month = that.setDate(that.request.data_desiderata, that.request.ora_desiderata, 'month');
            that.year = that.setDate(that.request.data_desiderata, that.request.ora_desiderata, 'year');
          }
          that.timeRequest = that.formatDate(this.request.time);
          that.initDatetime();
          console.log('requestManagerService ***** BSRequestByID *****', JSON.stringify(that.request));
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }
  }
  

  /** */
  initDatetime(){
    // var isoDate = creationDate(this.request.data_desiderata, this.request.ora_desiderata, "YYYY-MM-DDThh:mmZ"); //, "YYYY-MM-DDThh:mmTZD"
    //this.ionDatetime = new Date(isoDate).toISOString();
    // console.log("1-----------> ",isoDate);
    this.datetimeDisplayFormat = "DDD, DD MMM YYYY";
    this.datetimePickerFormat = "DD MMM YYYY";
    this.datetimeDisplayTimezone = "UTC";
    this.dateMonthShortNames = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    // this.datetimeDayShortNames = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    this.datetimeToday = formatDate(new Date());
    this.datetimeEndDate = addTimeToDate(this.datetimeToday, 'YYYY-MM-DDTHH:mm:ss', 365, 0, 0);
    this.datetimeMinuteValues = "0, 15, 30, 45";
    this.datetimeDoneText = "CONFERMA";
    this.datetimeCancelText = "ANNULLA";
    this.msgTime = 'Ora non specificata';
  }

  /** */
  setDate(dataDesiderata, oraDesiderata, type){
    moment.locale('it');
    if (dataDesiderata == '') return;
    var d = moment(dataDesiderata, 'YYYY-MM-DDThh:mmZ');
    let date = (moment(d).format('LLLL')).split(" ");
    console.log('data_richiesta: ', date);
    if (type == 'day') return date[0];
    if (type == 'numberDay') return date[1];
    if (type == 'month') return date[2];
    if (type == 'year') return date[3];
    if (type == 'hour') return "ore "+oraDesiderata;
  }

  formatDate(time){
    moment.locale('it');
    // var d = new Date(this.request.time); 
    var d = moment(time, 'YYYY-MM-DDThh:mmZ');
    let dateRequest = moment(d).format("D MMM YY");
    let timeRequest = moment(d).format("HH:mm");
    let resp = dateRequest+" ora "+timeRequest;
    console.log('curr_date:', resp);
    return resp;
  }

  callNumber(telefono){
    window.open('tel:' + telefono, '_system');
  }

  openEmail(email){
    window.open('mailto:' + email, '_blank')
  }

  /** */
  updateDate(){
    this.request.data_desiderata = this.dateDate;
    console.log('4 dateDate -------> '+JSON.stringify(this.dateDate));
    this.day = this.setDate(this.dateDate, '', 'day');
    this.numberDay = this.setDate(this.dateDate, '', 'numberDay');
    this.month = this.setDate(this.dateDate, '', 'month');
    this.year = this.setDate(this.dateDate, '', 'year');
    // this.initDateRequest(this.ionDatetime, '');
  }

  updateTime(){
    this.request.ora_desiderata = this.dateTime;
    console.log('5 dateTime -------> '+JSON.stringify(this.dateTime));
    let startTime  = formatDate(this.dateTime, 'HH:mm');
    let endDateTime  = addTimeToDate(this.dateTime, '', 0, 0, TIME_MINUTES_APPOINTMENT);
    let endTime = formatDate(endDateTime, 'HH:mm');
    this.stringOraDesiderata = " dalle "+ startTime + " alle " + endTime;
    //this.initDateRequest(this.ionDatetime, '');
  }

  /** */
  // initDateRequest(appointmentDate, timeDate){
  //   console.log ('appointmentDate : '+appointmentDate);
  //   let startDateTime  = creationDate(appointmentDate, timeDate);
  //   let endDateTime  = addTimeToDate(startDateTime, '', 0, 0, TIME_MINUTES_APPOINTMENT);
  //   let dateAppointment = creationDate(startDateTime, '', 'dddd, D MMM YYYY');
  //   let startTime  = formatDate(startDateTime, 'HH:mm');
  //   let endTime = formatDate(endDateTime, 'HH:mm');
  //   this.stringOraDesiderata = dateAppointment + " dalle "+ startTime + " alle " + endTime;
  //   console.log ('initDateRequest : '+this.stringOraDesiderata);
  //   let data_desiderata  = formatDate(startDateTime, 'YYYY-MM-DD');
  //   this.request.ora_desiderata = startTime;
  //   this.request.data_desiderata = data_desiderata;
  // }
  

  /** */
  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  /** */
  goBack(): void {
    this.navCtrl.back();
    // this.location.back();
    // this.navCtrl.navigateBack('/');
  }

  /** */
  openStartDate(){
    this.sDate.open();
    console.log('openStartDate');
  }
  openStartTime(){
    this.sTime.open();
    console.log('openStartTime');
  }

  /** */
  formulateQuote(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        request: JSON.stringify(this.request)
      }
    };
    this.router.navigate(['/request-quote'], navigationExtras);
    //this.router.navigateByUrl('/request-quote', { replaceUrl: true });
  }

  /** */
  private checkStatusRequest(status){
    this.requestManagerService.getRequestById(this.key);
    if(status == true){
      this.request.status = STATUS_100;
    }
  }

  /** */
  private unsubescribeAll() {
    console.log('unsubescribeAll: ', this.subscriptions);
    this.subscriptions.forEach(subscription => {
      subscription.value.unsubscribe(); // vedere come fare l'unsubscribe!!!!
    });
    this.subscriptions = [];
  }

}
