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

  constructor(
    // private data: DataService,
    private requestManagerService : RequestManagerService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) { 

  }

  ngOnInit() {
    this.key = this.activatedRoute.snapshot.paramMap.get('id');
    
    // this.requestManagerService.getRequestById(this.key);
  }

  ngAfterViewInit(){
    let that = this;
    this.initSubscriptions();
    console.log('getRequestsById: ' + this.key);
    this.requestManagerService.getRequestById(this.key);
    this.formatDate();
    // if(!this.request){
    //   console.log('NO request: ' + this.key);
    //   this.requestManagerService.getRequestById(this.key).subscribe((response) => {
    //     console.log(response);
    //     that.request = response;
    //     console.log('----------------------------------> this.request:'+that.request);
    //   })
    // }
  }

  /***/
  async initModal() {
    const that = this;
    const modal = await this.modalCtrl.create({
      component: FormulateQuotePage,
      cssClass: 'setting-modal',
      componentProps: {
        'request': that.request,
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      },
      backdropDismiss: true
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse !== null) {
        this.modalDataResponse = modalDataResponse.data;
        console.log('Modal Sent Data : '+ modalDataResponse.data);
      }
    });
    return await modal.present();
  }
  

  /***/
  initSubscriptions(){
    const that = this;
    this.requestManagerService.BSRequestByID.subscribe((request: any) => {
      if (request) {
        that.request = request;
        console.log('requestManagerService ***** BSRequestByID *****', that.request);
      }
    });
  }

  formatDate(){
    moment.locale('it');
    var  d = new Date(this.request.time); 
    let dateRequest = moment(d).format("D MMM YY");
    let timeRequest = moment(d).format("HH:mm");
    this.stringRequestTime = dateRequest+" ore "+timeRequest;
    console.log('curr_date:', this.stringRequestTime);
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inbox' : '';
  }

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

  
}
