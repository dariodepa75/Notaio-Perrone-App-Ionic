import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { DateRequestManagerService } from '../../services/date-request-manager.service';
import { DateRequestModel } from '../../models/date-request';

import { NavController } from '@ionic/angular';

import {LBL_DAY, LBL_MONTH, LBL_NUM_DAY, LBL_YEAR, STATUS_0, STATUS_100} from '../../utils/constants';
import { getFormattedDate, formatFromDateToString } from '../../utils/utils';


@Component({
  selector: 'app-detail-date-request',
  templateUrl: './detail-date-request.page.html',
  styleUrls: ['./detail-date-request.page.scss'],
})
export class DetailDateRequestPage implements OnInit {

  private subscriptions = [];
  public request: DateRequestModel;
  public key: string;
  public btnCalendario: string;

  public day: string;
  public numberDay: string;
  public month: string;
  public year: string;
  public timeRequest: string;
  public stringOraDesiderata: string;

  STATUS_0 = STATUS_0; // in attesa di risposta
  STATUS_100 = STATUS_100; // in attesa di pagamento

  constructor(
    private requestManagerService : DateRequestManagerService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) { }

  /** */
  ngOnInit() {
    this.key = this.activatedRoute.snapshot.paramMap.get('id');
    this.initSubscriptions();
  }

  /** */
  ngAfterViewInit(){
    this.btnCalendario = "Fissa appuntamento";
    console.log('getRequestsById: ' + this.key);
    this.requestManagerService.getDateRequestById(this.key);
  }

  /** */
  private initSubscriptions() {
    let subscribtionKey = '';
    let subscribtion: any;
    const that = this;

    subscribtionKey = 'BSRequestByID';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSRequestByID.subscribe((data: any) => {
        console.log('***** BSRequestByID *****', data);
        if (data) {
          that.request = data;
          that.setDate(this.request);
          that.formatDate(this.request);
          console.log('requestManagerService ***** BSRequestByID *****', that.request);
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }
  }

  /** */
  setDate(request){
    this.day = getFormattedDate(request.data_desiderata, LBL_DAY);
    this.numberDay = getFormattedDate(request.data_desiderata, LBL_NUM_DAY);
    this.month = getFormattedDate(request.data_desiderata, LBL_MONTH);
    this.year = getFormattedDate(request.data_desiderata, LBL_YEAR);
    this.stringOraDesiderata = "alle "+request.ora_desiderata;
  }

  /** */
  formatDate(request){
    this.timeRequest = formatFromDateToString(request.time);
  }
  

  addDateToCalendar(){

  }
  removeDateToCalendar(){
    
  }
  modifyDateToCalendar(){
    
  }


  // -------------------------------- //
  /** */
  ngOnDestroy() {
    console.log('UserPresenceComponent - ngOnDestroy');
    this.unsubescribeAll();
  }

  /** */
  goBack(): void {
    this.navCtrl.back();
  }

  /** */
  private checkStatusRequest(status){
    this.requestManagerService.getDateRequestById(this.key);
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
