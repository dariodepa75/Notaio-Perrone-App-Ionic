import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

import * as moment from 'moment';

import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import {
  STATUS_0, 
  STATUS_100, 
  MSG_FORMULATE_QUOTE
} from '../../utils/constants';


@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.page.html',
  styleUrls: ['./detail-request.page.scss'],
})
export class DetailRequestPage implements OnInit {
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

  STATUS_0 = STATUS_0; // in attesa di risposta
  STATUS_100 = STATUS_100; // in attesa di pagamento
  MSG_FORMULATE_QUOTE = MSG_FORMULATE_QUOTE;

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
    // this.requestManagerService.getRequestById(this.key);
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
  // async initModal() {
  //   const that = this;
  //   const modal = await this.modalCtrl.create({
  //     component: FormulateQuotePage,
  //     cssClass: 'setting-modal',
  //     componentProps: {
  //       'request': that.request
  //     },
  //     backdropDismiss: true
  //   });
  //   modal.dismiss();
  //   modal.onDidDismiss().then((modalDataResponse) => {
  //     // console.log('Modal Sent Data : '+ modalDataResponse.data);
  //     if (modalDataResponse.data == true) {
  //       this.checkStatusRequest(modalDataResponse.data);
  //     }
  //   });
  //   return await modal.present();
  // }
  

  

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
    this.stringOraDesiderata = "ore "+this.request.ora_desiderata;
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
  formulateQuote(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        //special: JSON.stringify('ciao')
        request: JSON.stringify(this.request)
      }
    };
    this.router.navigate(['request-quote'], navigationExtras);
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
