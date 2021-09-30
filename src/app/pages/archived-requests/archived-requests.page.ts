import { Component, OnInit } from '@angular/core';
import { RequestModel } from '../../models/request';
import { RequestManagerService } from '../../services/request-manager.service';
import { ManagerService } from '../../services/manager.service';
import { STATUS_300, MSG_EMPTY_REQUESTS } from '../../utils/constants';

@Component({
  selector: 'app-archived-requests',
  templateUrl: './archived-requests.page.html',
  styleUrls: ['./archived-requests.page.scss'],
})
export class ArchivedRequestsPage implements OnInit {
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
    this.getArchivedRequests(null);
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
    // subscribtionKey = 'BSArchivedRequests';
    // subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    // if (!subscribtion) {
    //   subscribtion =  this.requestManagerService.BSArchivedRequests.subscribe((data: any) => {
    //     console.log('***** BSArchivedRequests *****', data);
    //     if (data) {
    //       that.requestList = data;
    //     }
    //   });
    //   const subscribe = {key: subscribtionKey, value: subscribtion };
    //   this.subscriptions.push(subscribe);
    // }

    /** BSGetEmailTemplates */
    subscribtionKey = 'BSChangeStatus';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSChangeStatus.subscribe((data: any) => {
        console.log('***** BSChangeStatus *****', data);
        if (data) {
          that.getArchivedRequests(null);
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
      this.getArchivedRequests(event);
    }, 2000);
  }

  /** */
  getArchivedRequests(event) {
    console.log(' getArchivedRequests: ', event);
    const that = this;
    this.requestManagerService.getRequestsWithSubcribe(STATUS_300, false)
      .subscribe(data => {
        console.log(' data: ', data);
        that.managerService.setArchivedRequests(data);
        that.requestList = that.managerService.getArchivedRequests();
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
