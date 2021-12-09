import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

import { ManagerService } from './manager.service';
import { environment } from '../../environments/environment';
import { TOKEN_KEY, GOOGLE_TOKEN_KEY } from '../utils/constants';

import { UserModel } from '../models/user';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

 
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {


  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isGoogleToken: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  googleToken = '';
  user: UserModel;
  isMobile = false;

  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    public managerService: ManagerService,
    private authService: SocialAuthService
  ) {
    //this.refreshToken();
    this.loadToken();
    
    // this.googleCalendarGetToken();
    const that = this;

    this.authService.authState.subscribe((user) => {
      console.log('-------------------->>>>>> user: ', user, user.authToken);
      // if(user){
      //   that.user = user;
      //   localStorage.setItem(GOOGLE_TOKEN_KEY, user.authToken);
      //   that.managerService.setGToken(user.authToken);
      //   that.isGoogleToken.next(true);
      // } else {
      //   that.isGoogleToken.next(false);
      // }
    });
  }
 
  /** */
  async loadToken() {
    const token = await localStorage.getItem(TOKEN_KEY);    
    if (token) {
      console.log('set token: ', token);
      this.token = token;
      this.managerService.setToken(token);
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  /** */
  async loadGoogleToken() {
    const token = await localStorage.getItem(GOOGLE_TOKEN_KEY);    
    if (token) {
      console.log('set google token: ', token);
      this.googleToken = token;
      this.managerService.setGToken(token);
      return token;
    }
    return null;
  }
 


  // ********** googleCalendarGetToken *********** // 
  /** */
  async googleCalendarGetToken(){
    const isMobile = this.managerService.isMobile;// <boolean> await this.managerService.checkPlatform();
    console.log(' isMobile----->', isMobile);
    if(isMobile){
      this.googleCalendarGetTokenMobile();
    } else {
      this.googleCalendarGetTokenBrowser();
    }
  }

  /** */
  private async googleCalendarGetTokenMobile() {
    console.log(' googleCalendarGetTokenMobile ----->');
    const that = this;
    let url = environment.googleCalendarTokenEndpoint;
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    } 
    const params = { };
    this.http.get(url, params, headers)
    .then(resp => {
      console.log(' google Token: resp: ', JSON.stringify(resp));
      try {
        let data = JSON.parse(resp.data);
        let token = data.token;
        console.log(' google Token: ', token);
        localStorage.setItem(GOOGLE_TOKEN_KEY, token);
        that.managerService.setGToken(data.token);
        that.isGoogleToken.next(true);
      } catch(error) {
        that.isGoogleToken.next(false);
        console.log('error google Token:', error);
      }
    }).catch(error => {
      that.isGoogleToken.next(false);
      console.log('error google Token:', error);
    });
  }

  /** */
  private async googleCalendarGetTokenBrowser(){
    console.log(' googleCalendarGetTokenBrowser ----->');
    const that = this;
    let url = environment.googleCalendarTokenEndpoint;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {"":""}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    this.httpClient.get<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' google Token: ', data);
      localStorage.setItem(GOOGLE_TOKEN_KEY, data.token);
      that.managerService.setGToken(data.token);
      that.isGoogleToken.next(true);
    }, error => {
      that.isGoogleToken.next(false);
      console.log('error google Token:', error);
    });
  }
  // ********************************************* //



  // ****************** login ******************** // 
  /** */
  async login(username, password){
    // const isMobile = <boolean> await this.managerService.checkPlatform();
    const isMobile = this.managerService.isMobile;
    console.log(' isMobile----->', isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(isMobile){
      this.loginMobile(username, password);
    } else {
      // this.loginHttp(username, password);
      this.loginBrowser(username, password);
    }
  }

  /** */
  private loginMobile(username, password) {
    console.log(' loginHttp----->');
    const that = this;
    const params = { "username":username, "password":password };
    const header = { };
    this.http.post(environment.wpJsonUrl+'/jwt-auth/v1/token', params, header)
    .then(resp => {
      console.log('response 1: ', JSON.stringify(resp));
      try {
        let data = JSON.parse(resp.data);
        console.log(data.token);
        that.managerService.setToken(data.token);
        localStorage.setItem('token', data.token);
        that.managerService.stopLoader();
        that.isAuthenticated.next(true);
      } catch(e) {
        console.error('JSON parsing error');
        that.managerService.stopLoader();
        that.isAuthenticated.next(false);
      }
      
    }).catch(error => {
      console.log('error login:', JSON.stringify(error));
      that.managerService.stopLoader();
      that.isAuthenticated.next(false);
    });
  }

  /** */
  private loginBrowser(username, password) {
    console.log(' login----->');
    // username = "amministratore";
    // password = "R0IXZZgkguTcrBY$Wha3f2UB";
    const that = this;
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {"username": username, "password": password}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    this.httpClient.post<any>(environment.wpJsonUrl+'/jwt-auth/v1/token', postData)
    .subscribe(data => {
      console.log(' login data: ', data);
      console.log(data.token);
      this.managerService.setToken(data.token);
      //that.managerService.setAuthentication(username, password);
      localStorage.setItem('token', data.token);
      that.managerService.stopLoader();
      that.isAuthenticated.next(true);
    }, error => {
      console.log('error login', JSON.stringify(error));
      that.managerService.stopLoader();
      that.isAuthenticated.next(false);
    });
  }
  // ********************************************* //


  // refreshToken(): void {
  //   const googleLoginOptions = {
  //     scope: 'profile, email, https://www.googleapis.com/auth/calendar, https://www.googleapis.com/auth/calendar.events'
  //   }; 
  //   this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }

  //----------------------------//
  signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
    }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOutSocial(): void {
    localStorage.removeItem(GOOGLE_TOKEN_KEY);
    this.authService.signOut();
  }
  //----------------------------//
  
 
  /** */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isAuthenticated.next(false);
  }
}
