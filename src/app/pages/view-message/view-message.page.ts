import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

// import { DataService, Message } from '../../services/data.service';
import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import { FormulateQuotePage } from '../formulate-quote/formulate-quote.page';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public request: any;
  public key: string;
  public modalDataResponse: any;
  public stringRequestTime: string;
  public btnPreventivo: string;
  private subscriptions = [];

  constructor(
    // private data: DataService,
    private requestManagerService : RequestManagerService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) { 

  }

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
    this.formatDate();
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
  formatDate(){
    moment.locale('it');
    var  d = new Date(this.request.time); 
    let dateRequest = moment(d).format("D MMM YY");
    let timeRequest = moment(d).format("HH:mm");
    this.stringRequestTime = dateRequest+" ore "+timeRequest;
    console.log('curr_date:', this.stringRequestTime);
  }

  /** */
  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

  /** */
  goBack() {
    // this.router.navigate(['/login'])
    // this.location.back();
    // let animations:AnimationOptions={
    //   animated: true,
    //   animationDirection: "back"
    // }
    // this.navCtrl.back(animations)
    this.navCtrl.navigateBack('/');
  }

  /** */
  private checkStatusRequest(status){
    if(status == true){
      this.request.status = 1;
      this.checkRequestStatus();
      // this.btnPreventivo = "Dettaglio";
      // salva modifica nel db
    }
  }

  private checkRequestStatus(){
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

  /** */
  private unsubescribeAll() {
    console.log('unsubescribeAll: ', this.subscriptions);
    this.subscriptions.forEach(subscription => {
      subscription.value.unsubscribe(); // vedere come fare l'unsubscribe!!!!
    });
    this.subscriptions = [];
  }

}
