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

  // READ: https://ionicframework.com/docs/api/modal

  constructor(
    private modalCtr: ModalController,
    public requestManagerService: RequestManagerService,
    public navCtrl: NavController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.request.quesito = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    console.log('----> '+ this.request.quesito);
    this.initSubscriptions();
  }

  initSubscriptions(){
    this.requestManagerService.BSRequestSendMailQuotation.subscribe((requests: any) => {
      console.log('requestManagerService ***** BSRequestSendMailQuotation *****', requests);
      if (requests) {
        
      }
    });
  }

  async close() {
    console.log('price: ' + this.price);
    console.log('message: ' + this.message);
    const closeModal: string = "Modal Closed";
    await this.modalCtr.dismiss(this.price, this.message);
  }


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
    await alert.present();
  }

  private setQuotation(amount: any){
    this.request.price = amount;
    this.message = "Gentile "+this.request.nome+", abbiamo ricevuto con piacere la sua richiesta di preventivo. Le inviamo quindi la nostra migliore offerta per la consulenza richiesta. L'importo per il servizio richiesto è di "+amount+" da corrispondere anticipatamente come da indicazioni seguenti.";
    this.message += "\nNotaio Perrone Alessandro";
    
    
  }
  

  sendMessage(){
    console.log('sendMessage');
    this.requestManagerService.sendMailQuotationDesktop();
  }
 

}
