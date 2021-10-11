import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestModel } from '../../models/request';
import { RequestManagerService } from '../../services/request-manager.service';
import { ManagerService } from '../../services/manager.service';
import { ARRAY_STATUS, STATUS_0, MSG_EMPTY_REQUESTS } from '../../utils/constants';

@Component({
  selector: 'app-pending-payment-request',
  templateUrl: './pending-payment-request.page.html',
  styleUrls: ['./pending-payment-request.page.scss'],
})
export class PendingPaymentRequestPage implements OnInit {

  public requestList: RequestModel[] = [];
  private subscriptions = [];
  public MSG_EMPTY_REQUESTS = MSG_EMPTY_REQUESTS;
  public status = 100; // indica le request "in attesa di pagamento"

  constructor(
    private activatedRoute: ActivatedRoute,
    public managerService: ManagerService,
    public requestManagerService: RequestManagerService
  ) {}
  
  /** */
  ngOnInit() {
    console.log('ngOnInit');
    this.initSubscriptions();
    // this.requestManagerService.getRequests();
  }

  /** */
  ngAfterViewInit(){
    console.log('ngAfterViewInit');
    this.getRequests(null);
    //this.requestManagerService.getRequests();
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
    subscribtionKey = 'BSRequests';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSRequests.subscribe((data: any) => {
        console.log('***** BSRequests *****', data);
        if (data) {
          that.requestList = data;
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }


    /** BSGetEmailTemplates */
    subscribtionKey = 'BSChangeStatus';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSChangeStatus.subscribe((data: any) => {
        console.log('***** BSChangeStatus *****', data);
        if (data) {
          // that.requestList = that.requestList.filter(item => item.id !== data.id);
          that.getRequests(null);
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
      this.getRequests(event);
    }, 2000);
  }

  getRequests(event) {
    console.log(' getRequests: ', event);
    const that = this;
    this.requestManagerService.getRequestsWithSubcribe(this.status, false)
      .subscribe(data => {
        console.log(' data: ', data);
        that.managerService.setRequests(data);
        that.requestList = that.managerService.getRequests();
        if (event) event.target.complete();
      }, error => {
        console.log('error getRequestsDesktop', error);
        if (event) event.target.complete();
      });
  }

  loadRequestsForm(){
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
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
