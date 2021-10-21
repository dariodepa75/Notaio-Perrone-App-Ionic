import { Component, OnInit, Input } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { RequestManagerService } from '../../services/request-manager.service';
import { RequestModel } from '../../models/request';
import { formatDate } from '../../utils/utils';




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
  LBL_RICHIESTA_DEL = "RICHIESTA DEL";
  LBL_MODIFICA_IMPORTO = "Modifica importo";
  LBL_MODELLO_RISPOSTA = "Modello risposta";
  LBL_INVIA_MESSAGGIO = "Invia messaggio";
  LBL_PREVENTIVO = "Preventivo";
  LBL_ANNULLA = 'Annulla';
  LBL_CONFERMA = 'Conferma';

  MSG_ERROR_AMOUNT = 'Importo non valido';

  constructor(
    private route: ActivatedRoute,
    public requestManagerService: RequestManagerService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) { 
    this.route.queryParams.subscribe(params => {
      if (params && params.request) {
        console.log('request:: ', params.request);
        this.request = JSON.parse(params.request);
        this.formatTimeRequest();
      }
    });
  }

  /** */
  ngOnInit() {
    this.request.amount = "0,00";
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
          that.message = that.message.replace("$price", that.request.amount+"€"); 
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
        if (data != null) {
          if(data.message){
            that.presentAlertResponse(data.message, data.success);
          } else {
            that.presentAlertResponse(data, false);
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
  sendMessage(){
    console.log('sendMessage');
    if(parseFloat(this.request.amount) > 0){
      this.requestManagerService.sendMailQuotationDesktop(this.request, this.mailTo, this.subject, this.message);
    } else {
      this.presentAlertResponse(this.MSG_ERROR_AMOUNT, false);
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
    this.message = this.message.replace("$price", this.request.amount+"€"); 
    this.message = this.message.replace("$name", this.request.nome); 
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
          this.navCtrl.back();
          // this.modalCtr.dismiss(true).then(() => {
          //   let submission_id = this.request.submission_id;
          //   let form_id = this.request.form_id;
          //   let amount = this.request.price;
          //   let email_content =this.message;
          //   this.requestManagerService.setQuotationDesktop(submission_id, form_id, amount, email_content);
          // });
        }
      });
    }, 3000);
  }

  /** */
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'ddp-alert',
      header: this.LBL_PREVENTIVO,
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
          text: this.LBL_ANNULLA,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.LBL_CONFERMA,
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
