import { Injectable } from '@angular/core';
import { RequestModel } from '../models/request';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { ARRAY_STATUS, STATUS_400 } from '../utils/constants';
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
  public isMobile = true;
  private token: string;
  private username: string;
  private password: string;

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
    this.requestSelected = null;
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

  /** */
  setAuthentication(username, password){
    this.username = username;
    this.password = password;
  }

  /** */
  getAuthentication(){
    return ({ 'username': this.username, 'password': this.password })
  }


  /**
   * 
   * @param data 
   */
  setRequests(data){
    this.requests = data;
    this.requests.forEach(element => {
      if(element){
        this.checkRequestStatus(element);
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
        this.checkRequestStatus(element);
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
        this.checkRequestStatus(element);
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
    this.requestSelected = this.checkRequestStatus(request);
    // this.requestSelected.data_desiderata = this.formatDate(request.data_desiderata);
    // this.requestSelected.ora_desiderata = this.formatDate(request.ora_desiderata);
    console.log('************* set request Selected ***',this.requestSelected);
  }


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
  getRequestSelected(){
    console.log('************* get request Selected ***',this.requestSelected);
    return this.requestSelected;
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
  checkRequestStatus(request){
    let arrayStatus = ARRAY_STATUS;
    console.log(request.status);
    let status = request.status;
    if(request.trash == true){
      status = STATUS_400;
    }
    request.msg_status = arrayStatus[arrayStatus.length-1].message;
    request.chr_status = arrayStatus[arrayStatus.length-1].char;
    let item = this.filterArrayForCode(status, arrayStatus);
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
