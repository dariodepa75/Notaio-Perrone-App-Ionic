import { Injectable } from '@angular/core';
import { RequestModel } from '../models/request';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { ARRAY_STATUS } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {
  public isShowingLoader = false;
  public loader: any;


  public requests: RequestModel[] = [];
  public requestSelected: RequestModel;
  public isMobile = true;
  

  constructor(
    public platform: Platform,
    public loadingController: LoadingController
  ) { 
    //this.checkPlatform();
  }

  initialize() {
    this.requests = [];
    this.requestSelected = null;
    console.log('************* init manager ***');
  }

  /**
    * | android         | on a device running Android.       |
    * | cordova         | on a device running Cordova.       |
    * | ios             | on a device running iOS.           |
    * | ipad            | on an iPad device.                 |
    * | iphone          | on an iPhone device.               |
    * | phablet         | on a phablet device.               |
    * | tablet          | on a tablet device.                |
    * | electron        | in Electron on a desktop device.   |
    * | pwa             | as a PWA app.                      |
    * | mobile          | on a mobile device.                |
    * | mobileweb       | on a mobile device in a browser.   |
    * | desktop         | on a desktop device.               |
    * | hybrid          | is a cordova or capacitor app.
    */
  checkPlatform(){
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
          console.log("running on Android device!");
          this.isMobile = true;
      }
      if (this.platform.is('cordova')) {
        console.log("running in a browser on cordova!");
        this.isMobile = true;
      }
      if (this.platform.is('ios')) {
          console.log("running on iOS device!");
          this.isMobile = true;
      }
      if (this.platform.is('ipad')) {
        console.log("running in a browser on ipad!");
        this.isMobile = true;
      }
      if (this.platform.is('iphone')) {
        console.log("running in a browser on iphone!");
        this.isMobile = true;
      }
      if (this.platform.is('tablet')) {
          console.log("running in a browser on tablet!");
          this.isMobile = true;
      }
      if (this.platform.is('electron')) {
        console.log("running in a browser on electron!");
        this.isMobile = true;
      }
      if (this.platform.is('pwa')) {
        console.log("running in a browser on pwa!");
        this.isMobile = true;
      }
      if (this.platform.is('mobile')) {
        console.log("running in a browser on mobile!");
        this.isMobile = true;
      }
      if (this.platform.is('mobileweb')) {
        console.log("running in a browser on mobileweb!");
        this.isMobile = true;
      }
      if (this.platform.is('desktop')) {
        console.log("running in a browser on desktop!");
        this.isMobile = false;
      }
      if (this.platform.is('hybrid')) {
        console.log("running in a browser on hybrid!");
        this.isMobile = true;
      }

      if (!this.platform.is('cordova')) {
        console.log('Probably Browser');
        this.isMobile = false;
      }
      
    });
  }

  setRequests(data){
    this.requests = data;
    this.requests.forEach(element => {
      this.checkRequestStatus(element);
    });
    console.log('************* setRequests ***',this.requests);
  }

  getRequests(){
    console.log('************* getRequests ***',this.requests);
    return this.requests;
  }

  setRequestSelected(data){
    this.requestSelected = data;

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

  checkRequestStatus(request){
    let arrayStatus = ARRAY_STATUS;
    console.log(request.status);
    let item = this.filterArrayForCode(request.status, arrayStatus);
    if (item){
      console.log('---->3 ',item[0]);
      request.msg_status = item[0].message;
      request.chr_status = item[0].char;
    }
    
    //request.chr_status = arrayStatus['0'].char;
    //request.msg_status = arrayStatus['0'].message;
    /*
    switch(request.status) { 
      case '0': { 
        request.chr_status = arrayStatus['0'].char;
        request.msg_status = arrayStatus['0'].message;
        break; 
      } 
      case '100': { 
        request.chr_status = arrayStatus['100'].char;
        request.msg_status = arrayStatus['100'].message;
        break;
      } 
      case '200': { 
        request.chr_status = arrayStatus['200'].char;
        request.msg_status = arrayStatus['200'].message;
        break;
      } 
      case '300': { 
        request.chr_status = arrayStatus['300'].char;
        request.msg_status = arrayStatus['300'].message;
        break;
      } 
      default: { 
        request.chr_status = arrayStatus['400'].char;
        request.msg_status = arrayStatus['400'].message;
        break; 
      } 
    } 
    */
  }

}
