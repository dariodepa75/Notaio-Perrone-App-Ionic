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
    return this.token;
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
  async showLoader() {
    if (!this.isShowingLoader) {
      this.isShowingLoader = true
      this.loader = await this.loadingController.create({
        message: 'Please wait',
        duration: 5000
      });
      return await this.loader.present();
    }
  }

  /** */
  async stopLoader() {
    if (this.loader) {
      this.loader.dismiss()
      this.loader = null
      this.isShowingLoader = false
    }
  }

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
