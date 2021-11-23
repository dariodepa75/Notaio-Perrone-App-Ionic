import { Injectable } from '@angular/core';

import { RequestModel } from '../models/request';
import { DateRequestModel } from '../models/date-request';

import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { ARRAY_STATUS, ARRAY_STATUS_DATE_REQUEST, STATUS_400 } from '../utils/constants';
import { detectIsMobile } from '../utils/utils';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {
  public isShowingLoader = false;
  public loader: any;

  public requests: RequestModel[] = [];
  public archivedRequests: RequestModel[] = [];
  public trashedRequests: RequestModel[] = [];
  public requestSelected: RequestModel;

  public dateRequests: DateRequestModel[] = [];
  public dateRequestSelected: DateRequestModel;
  public archivedDateRequests: DateRequestModel[] = [];
  public trashedDateRequests: DateRequestModel[] = [];
  
  public isMobile = true;
  private token: string;
  private googleToken: string;
  // private username: string;
  // private password: string;

  constructor(
    public platform: Platform,
    public loadingController: LoadingController
  ) { 
    this.platform.ready().then(() => {
      // localStorage.getItem(JWT_KEY);
      // .then(data => {
      //   if (data) {
      //     this.user.next(data);
      //   }
      // })
    })
  }

  
  initialize() {
    this.requests = [];
    this.archivedRequests = [];
    this.trashedRequests = [];
    this.requestSelected = null;

    this.dateRequests = [];
    this.dateRequestSelected = null;
    console.log('************* init manager ***');
  }

  /** */
  checkPlatform(){
    this.isMobile = detectIsMobile(this.platform);
  }

  /** */
  setToken(token){
    this.token = token;
  }

  /** */
  getToken(){
    return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc3R1ZGlvLm5vdGFpb3BlcnJvbmUuaXQiLCJpYXQiOjE2MzcyNDE4NTYsIm5iZiI6MTYzNzI0MTg1NiwiZXhwIjoxNjM3ODQ2NjU2LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.6SJUg0GPnzZPlQwhZex9d0fKmzZZxKHK8N8XmyObEiU";
    // return this.token;
  }

  /** */
  setGToken(token){
    this.googleToken = token;
  }

  /** */
  getGToken(){
    return this.googleToken;
  }

  // /** */
  // setAuthentication(username, password){
  //   this.username = username;
  //   this.password = password;
  // }

  // /** */
  // getAuthentication(){
  //   return ({ 'username': this.username, 'password': this.password })
  // }




  //---------------------------------//
  // RICHIESTE CONSULENZA            //
  //---------------------------------//
  
  /** */
  setRequests(data){
    this.requests = data;
    this.requests.forEach(element => {
      if(element){
        this.checkRequestStatus(element, ARRAY_STATUS);
      }
    });
    console.log('************* setRequests ***',this.requests);
  }

  /** */
  getRequests(){
    console.log('************* getRequests ***',this.requests);
    return this.requests;
  }

  /** */
  setArchivedRequests(data){
    this.archivedRequests = data;
    this.archivedRequests.forEach(element => {
      if(element){
        this.checkRequestStatus(element, ARRAY_STATUS);
      }
    });
    console.log('************* set archivedRequests ***',this.archivedRequests);
  }

  /** */
  getArchivedRequests(){
    console.log('************* get archivedRequests ***',this.archivedRequests);
    return this.archivedRequests;
  }

  /** */
  setTrashedRequests(data){
    this.trashedRequests = data;
    this.trashedRequests.forEach(element => {
      if(element){
        this.checkRequestStatus(element, ARRAY_STATUS);
      }
    });
    console.log('************* set trashedRequests ***',this.trashedRequests);
  }

   /** */
   getTrashedRequests(){
    console.log('************* get TrashedRequests ***',this.trashedRequests);
    return this.trashedRequests;
  }

  /** */
  setRequestSelected(request){
    this.requestSelected = this.checkRequestStatus(request, ARRAY_STATUS);
    // this.requestSelected.data_desiderata = this.formatDate(request.data_desiderata);
    // this.requestSelected.ora_desiderata = this.formatDate(request.ora_desiderata);
    console.log('************* set request Selected ***',this.requestSelected);
  }

  /** */
  getRequestSelected(){
    console.log('************* get request Selected ***',this.requestSelected);
    return this.requestSelected;
  }



  //---------------------------------//
  // RICHIESTE APPUNTAMENTI          //
  //---------------------------------//

  /** */
  getDateRequests(){
    console.log('************* get DateRequests ***',this.dateRequests);
    return this.dateRequests;
  }
  
  /** */
  setDateRequests(data){
    this.dateRequests = data;
    this.dateRequests.forEach(element => {
      if(element){
        this.checkRequestStatus(element, ARRAY_STATUS_DATE_REQUEST);
      }
    });
    console.log('************* set dateRequests ***',this.dateRequests);
  }

  /** */
  setArchivedDateRequests(data){
    this.archivedDateRequests = data;
    this.archivedDateRequests.forEach(element => {
      if(element){
        this.checkRequestStatus(element, ARRAY_STATUS_DATE_REQUEST);
      }
    });
    console.log('************* set archivedDateRequests ***',this.archivedDateRequests);
  }

  /** */
  getArchivedDateRequests(){
    console.log('************* get archivedDateRequests ***',this.archivedDateRequests);
    return this.archivedDateRequests;
  }

  /** */
  setTrashedDateRequests(data){
    this.trashedDateRequests = data;
    this.trashedDateRequests.forEach(element => {
      if(element){
        this.checkRequestStatus(element, ARRAY_STATUS_DATE_REQUEST);
      }
    });
    console.log('************* set trashedDateRequests ***',this.trashedDateRequests);
  }

   /** */
   getTrashedDateRequests(){
    console.log('************* get trashedDateRequests ***',this.trashedDateRequests);
    return this.trashedDateRequests;
  }

  /** */
  setDateRequestSelected(request){
    this.dateRequestSelected = this.checkRequestStatus(request, ARRAY_STATUS_DATE_REQUEST);
    console.log('************* set date request Selected ***',this.dateRequestSelected);
  }

  /** */
  getDateRequestSelected(){
    console.log('************* get date request Selected ***',this.dateRequestSelected);
    return this.dateRequestSelected;
  }

  // END RICHIESTE APPUNTAMENTI               //
  //------------------------------------------//





  public selectRequestById(key:any) {
    console.log('selectRequestById', key);
    if(this.requests && this.requests.length > 0 ){
      let index = this.requests.findIndex(i => i.id === key);
      console.log('--->', this.requests[index]);
      this.requestSelected = this.requests[index];
      return this.requestSelected;
    }
  }

  


  /** */
  showLoader() {
    console.log('show Loader: ');
    const that = this;
    this.isShowingLoader = true;
    this.loadingController.create({
      message: 'Please wait',
      duration: 10000,
      backdropDismiss: true
    }).then((res) => {
      console.log(' present show Loader: ');
      if(that.isShowingLoader == true){
        res.present();
      }
    });
  }

  /** */
  stopLoader() {
    // Dismiss loader
    const that = this;
    this.isShowingLoader = false;
    console.log('stop loader: ', this.loadingController);
    // while (await this.loadingController.getTop() !== undefined) {
    //   await this.loadingController.dismiss();
    // }
    this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response);
    }).catch((err) => {
      console.log('Error occured : ', err);
    });
  }


  /** */
  filterArrayForCode(code, array): any {
    const item =  array.filter(function(handler) {
      return handler.code === code;
    });
    return item;
  }

  /** */
  checkRequestStatus(request, statusLabel){
    console.log(request.status);
    let status = request.status;
    if(request.trash == true){
      status = STATUS_400;
    }
    request.msg_status = statusLabel[statusLabel.length-1].message;
    request.chr_status = statusLabel[statusLabel.length-1].char;
    let item = this.filterArrayForCode(status, statusLabel);
    if (item.length > 0){
      console.log('checkRequestStatus ----> ',item[0]);
      request.msg_status = item[0].message;
      request.chr_status = item[0].char;
    } 
    return request; 
  }

  

  /** */
  formatDate(date){
    moment.locale('it');
    var  d = new Date(date); 
    return moment(d).format("D MMM YY");
  }

  /** */
  formatHour(time){
    moment.locale('it');
    var  d = new Date(time); 
    return moment(d).format("HH:mm");
  }

}
