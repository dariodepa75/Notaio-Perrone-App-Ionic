import { Component, OnInit, Input } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import { formatDate } from '../../utils/utils';
import { 
  MSG_GENERIC_KO,
  LBL_RICHIESTA_DEL,
  LBL_MODIFICA_IMPORTO,
  LBL_MODELLO_RISPOSTA,
  LBL_INVIA_MESSAGGIO,
  LBL_PREVENTIVO,
  LBL_ANNULLA,
  LBL_CONFERMA,
  MSG_ERROR_AMOUNT
} from '../../utils/constants';

import { environment } from '../../../environments/environment';




@Component({
  selector: 'app-request-quote',
  templateUrl: './request-quote.page.html',
  styleUrls: ['./request-quote.page.scss'],
})
export class RequestQuotePage implements OnInit {
  private subscriptions = [];
  public request: RequestModel;
  public price: string;
  public message: string;
  public templates: any;
  public templateSelected: any;
  public mailTo: string;
  public subject: string;
  public timeRequest: string;

  // ------------------------- //
  LBL_RICHIESTA_DEL = LBL_RICHIESTA_DEL;
  LBL_MODIFICA_IMPORTO = LBL_MODIFICA_IMPORTO;
  LBL_MODELLO_RISPOSTA = LBL_MODELLO_RISPOSTA;
  LBL_INVIA_MESSAGGIO = LBL_INVIA_MESSAGGIO;
  LBL_PREVENTIVO = LBL_PREVENTIVO;
  LBL_ANNULLA = LBL_ANNULLA;
  LBL_CONFERMA = LBL_CONFERMA;
  // MSG_ERROR_AMOUNT = MSG_ERROR_AMOUNT;
  // MSG_GENERIC_KO = MSG_GENERIC_KO;

  private urlPayment = environment.urlPayment;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    public requestManagerService: RequestManagerService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) { 
    this.activeRoute.queryParams.subscribe(params => {
      if (params && params.request) {
        console.log('request:: ', params.request);
        this.request = JSON.parse(params.request);
        this.formatTimeRequest();
      }
    });
  }

  /** */
  ngOnInit() {
    this.request.amount = "100,00";
    this.initSubscriptions();
    this.getEmailTemplates();
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
          let amount = that.request.amount.replace(".", ",")+"€";
          let urlPayment = that.urlPayment+"?submission_id="+that.request.submission_id;
          that.message = that.message.replace("{{amount}}", amount); 
          that.message = that.message.replace("{{name}}", that.request.nome); 
          that.message = that.message.replace("{{urlPayment}}", urlPayment); 
          that.mailTo = data.info.mailTo;
          that.subject = data.info.subject;
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }

    /** BSSetQuotation */
    subscribtionKey = 'BSSetQuotation';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSSetQuotation.subscribe((data: any) => {
        console.log('***** BSSetQuotation *****', data);
        if (data != null) {
          let msg = data.message?data.message:MSG_GENERIC_KO;
          if(data.success == true){
            that.sendMessage();
          } else {
            that.presentAlertResponse(msg, false);
          }
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
        if (data != null) {
          let msg = data.message?data.message:MSG_GENERIC_KO;
          if(data.success == true){
            that.presentAlertResponse(msg, data.success);
          } else {
            that.presentAlertResponse(msg, false);
          }
        } 
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }

  }


  //---------------------------------//
  /** */
  formatTimeRequest(){
    let dateTEMP = formatDate(this.request.time, "D MMM YY");
    let timeTEMP = formatDate(this.request.time, "HH:mm");
    this.timeRequest = dateTEMP+" ora "+timeTEMP;
    console.log('curr_date:', this.timeRequest);
  }

  private setQuotation(amount: any){
    this.request.amount = amount;
    this.templateFormSelected(this.templateSelected);
  }
  
  /** */
  saveQuotationOnBD(){
    let submission_id = this.request.submission_id;
    let form_id = this.request.form_id;
    let amount = this.request.amount;
    let email_content =this.message;
    let email = this.request.email;
    this.requestManagerService.setQuotation(submission_id, form_id, amount, email, email_content);
  }

  /** */
  sendMessage(){
    console.log('sendMessage');
    let email = this.request.email;
    if(parseFloat(this.request.amount) > 0){
      this.requestManagerService.sendMailQuotationDesktop(this.request, email, this.subject, this.message);
    } else {
      this.presentAlertResponse(MSG_ERROR_AMOUNT, false);
    }
  }
 
  /** */
  getEmailTemplates(){
    console.log('getEmailTemplates');
    this.requestManagerService.getEmailTemplates();
  }
  
  /** */
  templateFormSelected(newform) {
    console.log('templateFormSelected: ', newform);
    let selectedForm = this.templates.find((f)=>{
       return f.title === newform;
    });
    console.log('selectedForm: ', selectedForm);
    this.message = selectedForm.body;
    let amount = this.request.amount.replace(".", ",")+"€";
    let urlPayment = this.urlPayment+"?submission_id="+this.request.submission_id;
    this.message = this.message.replace("{{amount}}", amount); 
    this.message = this.message.replace("{{name}}", this.request.nome); 
    this.message = this.message.replace("{{urlPayment}}", urlPayment); 
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
          // this.navCtrl.back();
          this.router.navigate(['/pending-payment-request']);
          //this.modalCtr.dismiss(true).then(() => {
            // let submission_id = this.request.submission_id;
            // let form_id = this.request.form_id;
            // let amount = this.request.amount;
            // let email_content =this.message;
            // this.requestManagerService.setQuotationDesktop(submission_id, form_id, amount, email_content);
          //});
        }
      });
    }, 3000);
  }

  /** */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'ddp-alert',
      header: LBL_PREVENTIVO,
      inputs: [
        {
          name: 'amount',
          type: 'number',
          id: 'amount',
          value: this.request.amount,
          placeholder: '0.00'
        }
      ],
      buttons: [
        {
          text: LBL_ANNULLA,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: LBL_CONFERMA,
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


  // ----------------------------------- //

  /** */
  goBack(): void {
    this.navCtrl.back();
  }

  /** */
  private unsubescribeAll() {
    console.log('unsubescribeAll: ', this.subscriptions);
    this.subscriptions.forEach(subscription => {
      subscription.value.unsubscribe(); // vedere come fare l'unsubscribe!!!!
    });
    this.subscriptions = [];
  }
  // ----------------------------------- //

}
