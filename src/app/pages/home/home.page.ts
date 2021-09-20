import { Component } from '@angular/core';
import { DataService, Message } from '../../services/data.service';
import { RequestModel } from '../../models/request';
import { RequestManagerService } from '../../services/request-manager.service';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public requestList: RequestModel[] = [];
  segmentModel = "consulenza";

  constructor(
    private data: DataService,
    public managerService: ManagerService,
    public requestManagerService: RequestManagerService
  ) {
    this.initSubscriptions();
    this.requestManagerService.getRequests();
  }
  

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  initSubscriptions(){
    this.requestManagerService.BSRequests.subscribe((requests: any) => {
      console.log('requestManagerService ***** BSRequests *****', requests);
      if (requests) {
        this.requestList = requests;
      }
    });
  }


  getRequests() {
    
    
    
    // .then(data => {
    //   console.log(' getRequestsMobile----->', data);
    // }).catch(err => {
    //   console.log('error loadAppConfig', err);
    // });
    // this.requestManagerService.showLoader().then(()=>{
    //   this.requestManagerService.BSRequests.subscribe((requests: any) => {
    //     console.log('requestManagerService ***** BSRequests *****', requests);
    //     if (requests) {
    //       this.requestList = requests;
    //     }
    //   });
    // });


    // this.remoteService.getRequests().subscribe((response) => {
    //   console.log(response);
    //   this.requestList = response;
    //   console.log('----------------------------------> this.requestList:'+this.requestList);
    // })
  }

  loadRequestsForm(){

    // this.remoteService.getCannedResponses()
    //   .toPromise()
    //   .then(data => {
    //     console.log('----------------------------------> getCannedResponses:');
    //     console.log(data);
    //   }).catch(err => {
    //     console.log('error', err);
    //   });

    // .then(data => {
    //   console.log('----------------------------------> getData:');
    //   console.log(data);
    // }).catch(err => {
    //   console.log('error loadAppConfig' + err);
    // });

    // this.remoteService.loadRequestsForm().subscribe((data)=>{
    //     this.postList = data;
    // });
  }




  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

}
