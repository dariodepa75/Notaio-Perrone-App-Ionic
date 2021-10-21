import { Component, OnInit } from '@angular/core';
import { DateRequestModel } from '../../models/date-request';
import { DateRequestManagerService } from '../../services/date-request-manager.service';
import { ManagerService } from '../../services/manager.service';
import { MSG_EMPTY_REQUESTS } from '../../utils/constants';


@Component({
  selector: 'app-date-requests',
  templateUrl: './date-requests.page.html',
  styleUrls: ['./date-requests.page.scss'],
})
export class DateRequestsPage implements OnInit {

  public requestList: DateRequestModel[] = [];
  private subscriptions = [];
  MSG_EMPTY_REQUESTS = MSG_EMPTY_REQUESTS;

  constructor(
    public managerService: ManagerService,
    public requestManagerService: DateRequestManagerService
  ) {}
  
  /** */
  ngOnInit() {
    console.log('ngOnInit');
    this.initSubscriptions();
  }

  /** */
 
  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.getDateRequests(null);
  }

  // ionViewDidEnter(){
  //   console.log('ionViewDidEnter');
  // }
  // ionViewWillLeave(){
  //   console.log('ionViewWillLeave');
  // }
  // ionViewDidLeave(){
  //   console.log('ionViewDidLeave');
  // }
  // ngAfterViewInit(){
  //   console.log('ngAfterViewInit');
  // }


  /** */
  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.unsubescribeAll();
  }

  /** */
  private initSubscriptions() {
    let subscribtionKey = '';
    let subscribtion: any;
    const that = this;

    /** BSGetEmailTemplates */
    subscribtionKey = 'BSChangeDateStatus';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSChangeDateStatus.subscribe((data: any) => {
        console.log('***** BSChangeDateStatus *****', data);
        if (data) {
          that.getDateRequests(null);
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }
    
  }

  /** */
  refresh(event) {
    console.log(' refresh: ', event);
    setTimeout(() => {
      this.getDateRequests(event);
    }, 2000);
  }

  /** */
  getDateRequests(event) {
    console.log(' getDateRequests: ', event);
    const that = this;
    this.requestManagerService.getDateRequestsWithSubcribe(null, false)
      .subscribe(data => {
        console.log(' data: ', data);
        that.managerService.setDateRequests(data);
        that.requestList = that.managerService.getDateRequests();
        if (event) event.target.complete();
      }, error => {
        if (event) event.target.complete();
        console.log('error getRequestsDesktop', error);
      });
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
