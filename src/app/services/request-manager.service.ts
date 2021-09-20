import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// attive in platforms
import { HTTP } from '@ionic-native/http/ngx';
// active in web e dev
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ManagerService } from './manager.service';
import { RequestModel } from '../models/request';

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {

  // BehaviorSubject
  public BSRequests: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRequestByID: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRequestSendMailQuotation: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public requests: RequestModel[] = [];
  public requestSelected: RequestModel;

  // ENDPOINT 
  private requestsEndpoint = 'https://notaioperrone.it/API/requestsJson.php'; //'https://jsonplaceholder.typicode.com/todos/1';
  private sendMailEndpoint = 'https://notaioperrone.it/API/sendMail.php'
  constructor(
    public http: HTTP,
    public httpClient: HttpClient,
    public managerService: ManagerService
    ) {
  }


  // ---------------------------------- //
  // ELENCO E DETTAGLIO RICHIESTE
  // ---------------------------------- //
  /** 
   * getRequests
   * recupero elenco richieste consulenza e appuntamenti
   * su mobile o su desktop
  */
  getRequests(){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.showLoader();
    if(this.managerService.isMobile){
      //this.getRequestsMobile();
      this.getRequestsDesktop();
    } else {
      //this.getRequestsMobile();
      this.getRequestsDesktop();
    }
  }

  /** 
   * getRequestsMobile
   * su mobile le richieste vengono fatte con http 
   * perchè httpclient non funziona. 
   * Da verificare
  */
  private getRequestsMobile() {
    const that = this;
    console.log(' getRequestsMobile----->');
    const params = {};
    const header = { 'Content-Type': 'application/json' };
    this.http.get(this.requestsEndpoint, params, header)
    .then(data => {
      console.log(' data: ', data);
      console.log(data.status);
      that.managerService.setRequests(data);
      that.managerService.stopLoader();
      that.BSRequests.next(data);
    }).catch(error => {
      that.managerService.stopLoader();
      console.log('error getRequestsMobile', error);
    });
  }

  /** 
   * getRequestsDesktop
   * su desktop le richieste vengono fatte con httpClient. 
  */
  private getRequestsDesktop(){
    const that = this;
    console.log(' getRequestsDesktop----->');
    //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let postData = {"test": "001"}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    this.httpClient.get<any>(this.requestsEndpoint, httpOptions)
    .subscribe(data => {
      console.log(' data: ', data);
      console.log(data.status);
      that.managerService.setRequests(data);
      that.managerService.stopLoader();
      that.BSRequests.next(data);
    }, error => {
      that.managerService.stopLoader();
      console.log('error getRequestsDesktop', error);
    });
  }


  /**
   * getRequestById
   * recupero detteglio richiesta tramite id
   */
  getRequestById(key:any){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.requestSelected = this.selectRequestById(key);
    
    if(this.requestSelected){
      console.log('is requestSelected'); 
      this.BSRequestByID.next(this.requestSelected);
    } else {
      console.log('is NOT requestSelected'); 
      this.managerService.showLoader();
      if(this.managerService.isMobile){
        this.getRequestByIdMobile(key);
      } else {
        this.getRequestByIdDesktop(key);
      }
    }
  }

  /** 
   * getRequestByIdMobile
   * su mobile le richieste vengono fatte con http 
   * perchè httpclient non funziona. 
  */
  private getRequestByIdMobile(key:any){
    const that = this;
    console.log(' getRequestByIdMobile ----->');
    const params = {};
    const header = { 'Content-Type': 'application/json' };
    let url = this.requestsEndpoint + "?id=" + key;
    this.http.get(url, params, header)
    .then(data => {
      console.log(' data: ', data);
      console.log(data.status);
      that.managerService.setRequestSelected(data);
      that.managerService.stopLoader();
      that.BSRequestByID.next(data);
    }).catch(error => {
      that.managerService.stopLoader();
      console.log('error getRequestByIdMobile', error);
    });
  }

  /** 
   * getRequestByIdDesktop
   * su desktop le richieste vengono fatte con httpClient. 
  */
  private getRequestByIdDesktop(key:any){
    const that = this;
    console.log(' getRequestByIdDesktop ----->');
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json' );
    let postData = {"test": "001"}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    let url = this.requestsEndpoint + "?id=" + key;
    this.httpClient.get<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' data: ', data);
      that.managerService.setRequestSelected(data);
      that.managerService.stopLoader();
      that.BSRequestByID.next(data);
    }, error => {
      that.managerService.stopLoader();
      console.log('error getRequestsDesktop', error);
    });
  }

  /**
   * selectRequestById
   * restituisce il dettaglio della richiesta se è presente
   * nell'elenco richieste
  */
  public selectRequestById(key:any) {
    console.log('selectRequestById', key);
    this.requests = this.managerService.getRequests();
    if(this.requests && this.requests.length > 0 ){
      let index = this.requests.findIndex(i => i.id === key);
      console.log('--->', this.requests[index]);
      this.requestSelected = this.requests[index];
      return this.requestSelected;
    }
  }
  


  // ---------------------------------- //
  // PREVENTIVO
  // ---------------------------------- //
  sendMailQuotationDesktop(){
    const that = this;
    
    console.log(' sendMailQuotationDesktop ----->');
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json' );
    let postData = {"test": "001"}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    let url = this.sendMailEndpoint;
    this.managerService.showLoader();
    this.httpClient.post<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' data: ', data);
      that.managerService.setRequestSelected(data);
      that.managerService.stopLoader();
      that.BSRequestSendMailQuotation.next(data);
    }, error => {
      that.managerService.stopLoader();
      console.log('error sendMailQuotationDesktop', error);
    });
  }


  // ---------------------------------- //
  // httpClient OLD STYLE 
  // ---------------------------------- //
  public getRequestsByIdOld(key:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let url = this.requestsEndpoint + "?id=" + key;
    return this.httpClient.get<any>(url, httpOptions)
    .pipe(
      map((data:any ) => {
        /* do something with data */ 
        this.requestSelected = data;
        console.log('response!', this.requestSelected);
        return this.requestSelected;
        }
      ),
      catchError(this.handleError<any>(`get error`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


}
