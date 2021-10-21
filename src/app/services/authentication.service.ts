import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

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

  constructor(
    private httpClient: HttpClient,
    public managerService: ManagerService,
    private authService: SocialAuthService
  ) {
    //this.refreshToken();
    this.loadToken();
    const that = this;

    this.authService.authState.subscribe((user) => {
      console.log('-------------------->>>>>> user: ', user, user.authToken);
      // this.isLoggedin = (user != null);
      if(user){
        that.user = user;
        localStorage.setItem(GOOGLE_TOKEN_KEY, user.authToken);
        that.managerService.setGToken(user.authToken);
        that.isGoogleToken.next(true);
      } else {
        that.isGoogleToken.next(false);
      }
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
 
  /** */
  // login2(credentials: {email, password}): Observable<any> {
  //   return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
  //     map((data: any) => data.token),
  //     switchMap(token => {
  //       return from(Storage.set({key: TOKEN_KEY, value: token}));
  //     }),
  //     tap(_ => {
  //       this.isAuthenticated.next(true);
  //     })
  //   )
  // }

  /** */
  login(username, password) {
    console.log(' login----->');
    // username = "amministratore";
    // password = "R0IXZZgkguTcrBY$Wha3f2UB";
    const that = this;
    this.managerService.showLoader();
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
      that.managerService.stopLoader();
      that.isAuthenticated.next(true);
      //that.managerService.setAuthentication(username, password);
      localStorage.setItem('token', data.token);
    }, error => {
      that.managerService.stopLoader();
      that.isAuthenticated.next(false);
      console.log('error login', error);
    });
  }



  refreshToken(): void {
    const googleLoginOptions = {
      scope: 'profile, email, https://www.googleapis.com/auth/calendar, https://www.googleapis.com/auth/calendar.events'
    }; 
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

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
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return localStorage.remove(TOKEN_KEY);
  }
}
