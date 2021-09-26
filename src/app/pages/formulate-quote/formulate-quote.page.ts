import { Component, OnInit, Input } from '@angular/core';
import { ModalController, } from '@ionic/angular';
import { LoadingController, AlertController, Platform } from '@ionic/angular';

import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-formulate-quote',
  templateUrl: './formulate-quote.page.html',
  styleUrls: ['./formulate-quote.page.scss'],
})
export class FormulateQuotePage implements OnInit {
  
  @Input() request: any;

  public requestList: RequestModel[] = [];
  public price: string;
  public message: string;
  public templates: any;
  public templateSelected: any;
  public mailTo: string;
  public subject: string;
  private subscriptions = [];

  // READ: https://ionicframework.com/docs/api/modal

  constructor(
    private modalCtr: ModalController,
    public requestManagerService: RequestManagerService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) { }

  /** */
  ngOnInit() {
    // this.request.quesito = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    console.log('----> '+ this.request.quesito);
    this.request.price = "0,00";
    this.initSubscriptions();
    this.getEmailTemplates();
  }

  /** */
  ngOnDestroy() {
    console.log('UserPresenceComponent - ngOnDestroy');
    this.unsubescribeAll();
  }

  private initSubscriptions() {
    let subscribtionKey = '';
    let subscribtion: any;
    const that = this;
    console.log('***** initSubscriptions *****');
    
    /** BSGetEmailTemplates */
    subscribtionKey = 'BSGetEmailTemplates';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSGetEmailTemplates.subscribe((data: any) => {
        console.log('***** BSGetEmailTemplates *****', data);
        if (data) {
          that.templates = data.templates;
          that.templateSelected = that.templates[0].title;
          that.message = that.templates[0].body;
          that.message = that.message.replace("$price", that.request.price+"€"); 
          that.message = that.message.replace("$name", that.request.nome); 
          that.mailTo = data.info.mailTo;
          that.subject = data.info.subject;
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }

    /** BSRequestSendMailQuotation */
    subscribtionKey = 'BSRequestSendMailQuotation';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSRequestSendMailQuotation.subscribe((data: any) => {
        console.log('***** BSRequestSendMailQuotation *****', data);
        if (data && that.request.price > 0) {
          if(data.message){
            that.presentAlertResponse(data.message, data.success);
            // this.presentAlertResponse('test error', true);
          } else {
            that.presentAlertResponse(data, false);
          }
        } 
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }
  }

  /** */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'ddp-alert',
      header: 'Preventivo',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          id: 'amount',
          value: this.request.price,
          placeholder: '0.00'
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Conferma',
          handler: (alertData) => {
            this.setQuotation(alertData.amount);
            console.log('Confirm Ok', alertData.amount);
          }
        }
      ]
    });
    alert.dismiss();
    await alert.present();
  }

  /** */
  async presentAlertResponse(msg, success) {
    const alert = await this.alertController.create({
      message: msg
    });
    alert.dismiss();
    await alert.present();
    setTimeout(()=>{
      alert.dismiss().then(() => {
        if (success == true) {
          this.modalCtr.dismiss(true).then(() => {
            let submission_id = this.request.submission_id;
            let form_id = this.request.form_id;
            let amount = this.request.price;
            let email_content =this.message;
            this.requestManagerService.setQuotationDesktop(submission_id, form_id, amount, email_content);
          });
        }
      });
    }, 3000);
    // const { role } = await alert.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }

  //---------------------------------//
  private setQuotation(amount: any){
    this.request.price = amount;
    this.templateFormSelected(this.templateSelected);
  }
  

  sendMessage(){
    console.log('sendMessage');
    this.requestManagerService.sendMailQuotationDesktop(this.request, this.mailTo, this.subject, this.message);
  }
 

  getEmailTemplates(){
    console.log('getEmailTemplates');
    this.requestManagerService.getEmailTemplates();
  }
  

  templateFormSelected(newform) {
    console.log('templateFormSelected: ', newform);
    let selectedForm = this.templates.find((f)=>{
       return f.title === newform;
    });
    console.log('selectedForm: ', selectedForm);
    this.message = selectedForm.body;
    this.message = this.message.replace("$price", this.request.price+"€"); 
    this.message = this.message.replace("$name", this.request.nome); 
  }



  /** */
  async close() {
    console.log('price: ' + this.price);
    console.log('message: ' + this.message);
    const closeModal: string = "Modal Closed";
    await this.modalCtr.dismiss(false);
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
