import { Component, OnInit } from '@angular/core';
import { RequestModel } from '../../models/request';
import { RequestManagerService } from '../../services/request-manager.service';
import { ManagerService } from '../../services/manager.service';
import { MSG_EMPTY_REQUESTS } from '../../utils/constants';


@Component({
  selector: 'app-trashed-requests',
  templateUrl: './trashed-requests.page.html',
  styleUrls: ['./trashed-requests.page.scss'],
})
export class TrashedRequestsPage implements OnInit {

  public requestList: RequestModel[] = [];
  private subscriptions = [];
  MSG_EMPTY_REQUESTS = MSG_EMPTY_REQUESTS;

  constructor(
    public managerService: ManagerService,
    public requestManagerService: RequestManagerService
  ) {}
  
  /** */
  ngOnInit() {
    console.log('ngOnInit');
    this.initSubscriptions();
  }

  /** */
  ngAfterViewInit(){
    console.log('ngAfterViewInit');
    this.getTrashedRequests(null);
  }

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
    subscribtionKey = 'BSChangeStatus';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSChangeStatus.subscribe((data: any) => {
        console.log('***** BSChangeStatus *****', data);
        if (data) {
          that.getTrashedRequests(null);
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
      this.getTrashedRequests(event);
    }, 2000);
  }

  /** */
  getTrashedRequests(event) {
    console.log(' getTrashedRequests: ', event);
    const that = this;
    this.requestManagerService.getRequestsWithSubcribe(null, true)
      .subscribe(data => {
        console.log(' data: ', data);
        that.managerService.setTrashedRequests(data);
        that.requestList = that.managerService.getTrashedRequests();
        if (event) event.target.complete();
      }, error => {
        if (event) event.target.complete();
        console.log('error getTrashedRequests', error);
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
