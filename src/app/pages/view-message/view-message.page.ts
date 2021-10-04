import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import { FormulateQuotePage } from '../formulate-quote/formulate-quote.page';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';

import {STATUS_100} from '../../utils/constants';


@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public request: any;
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

  constructor(
    private requestManagerService : RequestManagerService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) { }

  /** */
  ngOnInit() {
    this.key = this.activatedRoute.snapshot.paramMap.get('id');
    this.initSubscriptions();
    // this.requestManagerService.getRequestById(this.key);
  }

  /** */
  ngAfterViewInit(){
    this.btnPreventivo = "Formula preventivo";
    console.log('getRequestsById: ' + this.key);
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
        console.log('***** BSRequestByID *****', data);
        if (data) {
          that.request = data;
          that.setDate();
          that.formatDate();
          console.log('requestManagerService ***** BSRequestByID *****', that.request);
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }
  }


  /** */
  async initModal() {
    const that = this;
    const modal = await this.modalCtrl.create({
      component: FormulateQuotePage,
      cssClass: 'setting-modal',
      componentProps: {
        'request': that.request
      },
      backdropDismiss: true
    });
    modal.dismiss();
    modal.onDidDismiss().then((modalDataResponse) => {
      console.log('Modal Sent Data XXX : '+ modalDataResponse.data);
      if (modalDataResponse.data == true) {
        this.checkStatusRequest(modalDataResponse.data);
      }
    });
    return await modal.present();
  }
  

  

  /** */
  setDate(){
    moment.locale('it');
    var  d = new Date(this.request.data_desiderata); 
    let date = (moment(d).format('LLLL')).split(" ");
    console.log('data_richiesta: ', date);
    this.day = date[0];
    this.numberDay = date[1];
    this.month = date[2];
    this.year = date[3];
    this.stringOraDesiderata = "alle "+this.request.ora_desiderata;
  }

  formatDate(){
    moment.locale('it');
    var  d = new Date(this.request.time); 
    let dateRequest = moment(d).format("D MMM YY");
    let timeRequest = moment(d).format("HH:mm");
    this.timeRequest = dateRequest+" ora "+timeRequest;
    console.log('curr_date:', this.timeRequest);
  }

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
