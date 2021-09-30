import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// attive in platforms
import { HTTP } from '@ionic-native/http/ngx';
// active in web e dev
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ManagerService } from './manager.service';
import { RequestModel } from '../models/request';
import { STATUS_0, STATUS_100, STATUS_200, STATUS_300 } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {

  // BehaviorSubject
  public BSRequests: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRequestByID: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRequestSendMailQuotation: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSGetEmailTemplates: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSSetQuotation: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSChangeStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  public requests: RequestModel[] = [];
  public requestSelected: RequestModel;

  // ENDPOINT 
  private requestsEndpoint = 'https://notaioperrone.it/API/requestsJson.php'; //'https://jsonplaceholder.typicode.com/todos/1';
  private sendMailEndpoint = 'https://notaioperrone.it/API/sendMail.php';
  private emailTemplateEndpoint = 'https://notaioperrone.it/API/emailTemplate.php';
  private setQuotationEndpoint = 'https://notaioperrone.it/API/setQuotation.php';
  private setStatusRequestEndpoint = 'https://notaioperrone.it/API/setStatus.php';
  

  constructor(
    public http: HTTP,
    public httpClient: HttpClient,
    public managerService: ManagerService
    ) {
  }


  // ---------------------------------- //
  // ELENCO E DETTAGLIO RICHIESTE
  // ---------------------------------- //

  /** */
  getRequestsWithSubcribe(status, trash){
    console.log(' getRequestsDesktop----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let httpOptions = {
      headers: headers,
      params: { 'status': status, 'trash': trash }
    };
    return this.httpClient.get<any>(this.requestsEndpoint, httpOptions);
  }

  /** */
  // getArchivedRequestsWithSubcribe(status){
  //   console.log(' getRequestsDesktop----->');
  //   var headers = new HttpHeaders();
  //   headers.append("Accept", 'application/json');
  //   headers.append('Content-Type', 'application/json');
  //   let httpOptions = {
  //     headers: headers,
  //     params: { 'status': status }
  //   };
  //   return this.httpClient.get<any>(this.requestsEndpoint, httpOptions);
  // }
  
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
      that.BSRequests.next(error);
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
    headers.append('Content-Type', 'application/json');
    let postData = {"type": ''}
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
      that.BSRequests.next(error);
      console.log('error getRequestsDesktop', error);
    });
  }


  /** */
  getRequestById(key:any){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.showLoader();
    if(this.managerService.isMobile){
      // this.getRequestByIdMobile(key);
      this.getRequestByIdDesktop(key);
    } else {
      this.getRequestByIdDesktop(key);
    }
  }

  /** */
  private getRequestByIdDesktop(key:any){
    const that = this;
    console.log(' getRequestByIdDesktop ----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {"":""}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    let url = this.requestsEndpoint + "?id=" + key;
    this.httpClient.get<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' getRequestByIdDesktop data: ', data);
      that.managerService.setRequestSelected(data);
      that.managerService.stopLoader();
      let requestSelected = that.managerService.getRequestSelected();
      that.BSRequestByID.next(requestSelected);
    }, error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      console.log('error getRequestsDesktop', error);
    });
  }

  /**
   * getRequestById
   * recupero detteglio richiesta tramite id
   */
  getRequestByIdOLD(key:any){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.requestSelected = this.selectRequestById(key);
    
    if(this.requestSelected){
      console.log('is requestSelected'); 
      this.BSRequestByID.next(this.requestSelected);
    } else {
      console.log('is NOT requestSelected'); 
      this.managerService.showLoader();
      if(this.managerService.isMobile){
        // this.getRequestByIdMobile(key);
      } else {
        // this.getRequestByIdDesktop(key);
      }
    }
  }

  /** 
   * getRequestByIdMobile
   * su mobile le richieste vengono fatte con http 
   * perchè httpclient non funziona. 
  */
  private getRequestByIdMobileOLD(key:any){
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
      let requestSelected = that.managerService.getRequestSelected();
      that.BSRequestByID.next(requestSelected);
    }).catch(error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      console.log('error getRequestByIdMobile', error);
    });
  }

  /** 
   * getRequestByIdDesktop
   * su desktop le richieste vengono fatte con httpClient. 
  */
  private getRequestByIdDesktopOLD(key:any){
    const that = this;
    console.log(' getRequestByIdDesktop ----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {"": ""}
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
      let requestSelected = that.managerService.getRequestSelected();
      that.BSRequestByID.next(requestSelected);
    }, error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
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
  getEmailTemplates(){
    const that = this;
    console.log(' getEmailTemplates----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {"": ""}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    this.httpClient.get<any>(this.emailTemplateEndpoint, httpOptions)
    .subscribe(data => {
      console.log(' getEmailTemplate data: ', data);
      console.log(data.status);
      // that.managerService.setEmailTemplates(data);
      that.managerService.stopLoader();
      that.BSGetEmailTemplates.next(data);
    }, error => {
      that.managerService.stopLoader();
      that.BSGetEmailTemplates.next(error);
      console.log('error getRequestsDesktop', error);
    });
  }
  
  /**
   * 
   */
  sendMailQuotationDesktop(request, mailTo, subject, message){
    const that = this;
    console.log(' sendMailQuotationDesktop ----->');
    let basicAuth: string = btoa("admin:12345678");
    let url = this.sendMailEndpoint;
    this.managerService.showLoader();
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + basicAuth,
    } 
    const params = new HttpParams({
      fromObject: { 
        to : mailTo,
        subject : subject,
        message : message,
        from : request.email, 
        name: request.nome
      }
    });
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' data: ', data);
      that.managerService.stopLoader();
      that.BSRequestSendMailQuotation.next(data);
    }, error => {
      that.managerService.stopLoader();
      that.BSRequestSendMailQuotation.next(error);
      console.log('error sendMailQuotationDesktop', error);
    });
  }


  /**
   * 
   */
  setQuotationDesktop(submission_id, form_id, amount, email_content){
    const that = this;
    console.log(' setQuotationDesktop ----->');
    let url = this.setQuotationEndpoint;
    this.managerService.showLoader();
    let basicAuth: string = btoa("admin:12345678");
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + basicAuth,
    } 
    const params = new HttpParams({
      fromObject: { 
        submission_id: submission_id,
        form_id : form_id,
        amount : amount,
        email_content : email_content
      }
    });
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log('BSSetQuotation data: ', data);
      that.managerService.stopLoader();
      that.BSSetQuotation.next(data);
    }, error => {
      console.log('error BSSetQuotation', error);
      that.managerService.stopLoader();
      that.BSSetQuotation.next(error);
    });
  }




  // ---------------------------------- //
  // CHANGE STATUS
  // ---------------------------------- //
  requestToBeArchived(item, request){
    console.log('requestToBeArchived:', item);
    this.changeStatus(request.id, STATUS_300, false);
  }

  /** */
  requestToBePrevious(item, request){
    let status = STATUS_100;
    if(request.status == STATUS_300){
      status = STATUS_200;
    } else if(request.status == STATUS_200){
      status = STATUS_100;
    } else if(request.status == STATUS_100){
      status = STATUS_0;
    }
    console.log('requestToBePrevious:', item);
    this.changeStatus(request.id, status, false);
  }

  /** */
  requestToBeRestored(item, request){
    console.log('requestToBeRestored:', item);
    this.changeStatus(request.id, STATUS_0, false);
  }
  

  /** */
  requestToBeTrashed(item, request){
    console.log('requestToBeTrashed:', request.id);
    this.changeStatus(request.id, request.status, true);
  }

  /** */
  private changeStatus(requestId, STATUS, trash){
    const that = this;
    let url = this.setStatusRequestEndpoint;
    let basicAuth: string = btoa("admin:12345678");
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + basicAuth,
    } 
    const params = new HttpParams()
    .set('request_id', requestId)
    .set('status', STATUS)
    .set('trash', trash);
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' setStatusRequestEndpoint data: ', data);
      that.BSChangeStatus.next(true);
    }, error => {
      console.log('error setStatusRequestEndpoint', error);
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
