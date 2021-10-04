import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { ManagerService } from './manager.service';
import { environment } from '../../environments/environment';
import { TOKEN_KEY } from '../utils/constants';

 
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {


  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
 
  constructor(
    private httpClient: HttpClient,
    public managerService: ManagerService
  ) {
    this.loadToken();
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


  
 
  /** */
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return localStorage.remove(TOKEN_KEY);
  }
}
