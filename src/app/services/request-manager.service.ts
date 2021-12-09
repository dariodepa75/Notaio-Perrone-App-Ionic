import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// attive in platforms
import { HTTP } from '@ionic-native/http/ngx';
// active in web e dev
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ManagerService } from './manager.service';
import { RequestModel } from '../models/request';
import { ARRAY_STATUS, STATUS_0, STATUS_100, STATUS_200, STATUS_300 } from '../utils/constants';

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
  // private requestsEndpoint = 'https://notaioperrone.it/API/requestsJson.php'; //'https://jsonplaceholder.typicode.com/todos/1';
  // private sendMailEndpoint = 'https://notaioperrone.it/API/sendMail.php';
  // private emailTemplateEndpoint = 'https://notaioperrone.it/API/emailTemplate.php';
  // private setQuotationEndpoint = 'https://notaioperrone.it/API/setQuotation.php';
  // private setStatusRequestEndpoint = 'https://notaioperrone.it/API/setStatus.php';

  

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
    return this.httpClient.get<any>(environment.requestsEndpoint, httpOptions);
  }
  
  /** 
   * getRequests
   * recupero elenco richieste consulenza e appuntamenti
   * su mobile o su desktop
  */
  getRequests(){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(this.managerService.isMobile){
      this.getRequestsMobile();
    } else {
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
    this.http.get(environment.requestsEndpoint, params, header)
    .then(data => {
      console.log(' data: ', data);
      console.log(data.status);
      that.managerService.setRequests(data);
      that.managerService.stopLoader();
      that.BSRequests.next(data);
      setTimeout(() => {
        that.BSRequests.next(null);
      }, 100);
    }).catch(error => {
      console.log('error getRequestsMobile', error);
      that.managerService.stopLoader();
      that.BSRequests.next(error);
      setTimeout(() => {
        that.BSRequests.next(null);
      }, 100);
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
    this.httpClient.get<any>(environment.requestsEndpoint, httpOptions)
    .subscribe(data => {
      console.log(' data: ', data);
      console.log(data.status);
      that.managerService.setRequests(data);
      that.managerService.stopLoader();
      that.BSRequests.next(data);
      setTimeout(() => {
        that.BSRequests.next(null);
      }, 100);
    }, error => {
      console.log('error getRequestsDesktop', error);
      that.managerService.stopLoader();
      that.BSRequests.next(error);
      setTimeout(() => {
        that.BSRequests.next(null);
      }, 100);
    });
  }


  // ************************************************** //
  /** */
  getRequestById(key:any){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(this.managerService.isMobile == true){
      // this.getRequestByIdDesktop(key);
      this.getRequestByIdMobile(key);
    } else {
      this.getRequestByIdDesktop(key);
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
    const header = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Content-Type': 'application/json', 
      'Accept': 'application/json' 
    };
    let url = environment.requestsEndpoint + "?id=" + key;
    this.http.get(url, params, header)
    .then(resp => {
      console.log(' data getRequestByIdMobile: ', JSON.stringify(resp.data));
      that.managerService.setRequestSelected(JSON.parse(resp.data));
      let requestSelected = that.managerService.getRequestSelected();
      that.managerService.stopLoader();
      that.BSRequestByID.next(requestSelected);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 100);
    }).catch(error => {
      console.log('error getRequestByIdMobile: ', error);
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 100);
    });
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
    let url = environment.requestsEndpoint + "?id=" + key;
    this.httpClient.get<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' getRequestByIdDesktop data: ', data);
      that.managerService.setRequestSelected(data);
      let requestSelected = that.managerService.getRequestSelected();
      that.managerService.stopLoader();
      that.BSRequestByID.next(requestSelected);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 200);
    }, error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 200);
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
    this.managerService.stopLoader();
    this.managerService.showLoader();
    console.log(' getEmailTemplates----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = {"": ""}
    let httpOptions = {
      headers: headers,
      data: postData
    };
    this.httpClient.get<any>(environment.emailTemplateEndpoint, httpOptions)
    .subscribe(data => {
      console.log(' getEmailTemplate data: ', data);
      console.log(data.status);
      // that.managerService.setEmailTemplates(data);
      that.managerService.stopLoader();
      that.BSGetEmailTemplates.next(data);
      setTimeout(() => {
        that.BSGetEmailTemplates.next(null);
      }, 100);
    }, error => {
      console.log('error getRequestsDesktop', error);
      that.managerService.stopLoader();
      that.BSGetEmailTemplates.next(error);
      setTimeout(() => {
        that.BSGetEmailTemplates.next(null);
      }, 100);
    });
  }
  

  // ************************************************** //
  sendMailQuotation(request, mailTo, subject, ext, message){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(this.managerService.isMobile == true){
      this.sendMailQuotationMobile(request, mailTo, subject, ext, message);
    } else {
      this.sendMailQuotationDesktop(request, mailTo, subject, ext, message);
    }
  }

  /** */
  private sendMailQuotationMobile(request, mailTo, subject, ext, message){
    const that = this;
    console.log(' sendMailQuotationMobile ----->');
    let token = this.managerService.getToken();
    let url = environment.sendMailEndpoint;
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token,
    } 
    const params = {
      'ext': ext,
      'to': mailTo,
      'subject' : subject,
      'message' : message,
      'name': request.nome
    };
    this.http.post(url, params, headers)
    .then(resp => {
      console.log('data sendMailQuotationMobile: ', JSON.stringify(resp.data));
      that.managerService.stopLoader();
      let data = JSON.parse(resp.data);
      that.BSRequestSendMailQuotation.next(data);
      setTimeout(() => {
        that.BSRequestSendMailQuotation.next(null);
      }, 100);
    }).catch(error => {
      console.log('error sendMailQuotationMobile',  JSON.stringify(error));
      that.managerService.stopLoader();
      that.BSRequestSendMailQuotation.next(error);
      setTimeout(() => {
        that.BSRequestSendMailQuotation.next(null);
      }, 100);
    });
  }

  /** */
  private sendMailQuotationDesktop(request, mailTo, subject, ext, message){
    const that = this;
    console.log(' sendMailQuotationDesktop ----->');
    let token = this.managerService.getToken();
    let url = environment.sendMailEndpoint;
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token,
    } 
    const params = new HttpParams({
      fromObject: { 
        ext: ext,
        to : mailTo,
        subject : subject,
        message : message,
        name: request.nome
      }
    });
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' data: ', data);
      that.managerService.stopLoader();
      that.BSRequestSendMailQuotation.next(data);
      setTimeout(() => {
        that.BSRequestSendMailQuotation.next(null);
      }, 100);
    }, error => {
      console.log('error sendMailQuotationDesktop', error);
      that.managerService.stopLoader();
      that.BSRequestSendMailQuotation.next(error);
      setTimeout(() => {
        that.BSRequestSendMailQuotation.next(null);
      }, 100);
    });
  }




  // ************************************************** //
  /** */
  setQuotation(submission_id, form_id, amount, email, email_content){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(this.managerService.isMobile == true){
      // this.getRequestByIdDesktop(key);
      this.setQuotationMobile(submission_id, form_id, amount, email, email_content);
    } else {
      this.setQuotationDesktop(submission_id, form_id, amount, email, email_content);
    }
  }

  private setQuotationMobile(submission_id, form_id, amount, email, email_content){
    const that = this;
    console.log(' setQuotationMobile ----->');
    let url = environment.setQuotationEndpoint;
    let token = this.managerService.getToken();
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    };
    const params = {
      'submission_id': submission_id,
      'form_id' : form_id,
      'amount' : amount,
      'email_content' : email_content,
      'email': email
    };

    this.http.post(url, params, headers)
    .then(resp => {
      console.log('data setQuotationMobile: ', JSON.stringify(resp.data));
      let data = JSON.parse(resp.data);
      that.managerService.stopLoader();
      that.BSSetQuotation.next(data);
      setTimeout(() => {
        that.BSSetQuotation.next(null);
      }, 100);
    }).catch(error => {
      console.log('error BSSetQuotation',  JSON.stringify(error));
      that.managerService.stopLoader();
      that.BSSetQuotation.next(error);
      setTimeout(() => {
        that.BSSetQuotation.next(null);
      }, 100);
    });
  }

  /** */
  setQuotationDesktop(submission_id, form_id, amount, email, email_content){
    const that = this;
    this.managerService.stopLoader();
    this.managerService.showLoader();
    console.log(' setQuotationDesktop ----->');
    let url = environment.setQuotationEndpoint;
    let token = this.managerService.getToken();
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    const params = new HttpParams({
      fromObject: { 
        submission_id: submission_id,
        form_id : form_id,
        amount : amount,
        email_content : email_content,
        email: email
      }
    });
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log('BSSetQuotation data: ', data);
      that.managerService.stopLoader();
      that.BSSetQuotation.next(data);
      setTimeout(() => {
        that.BSSetQuotation.next(null);
      }, 100);
    }, error => {
      console.log('error BSSetQuotation', error);
      that.managerService.stopLoader();
      that.BSSetQuotation.next(error);
      setTimeout(() => {
        that.BSSetQuotation.next(null);
      }, 100);
    });
  }




  // ---------------------------------- //
  // CHANGE STATUS
  // ---------------------------------- //
  requestToBeArchived(item, request){
    console.log('requestToBeArchived:', item);
    this.changeStatus(request, STATUS_300, false);
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
    this.changeStatus(request, status, false);
  }

  /** */
  requestToBeRestored(item, request){
    console.log('requestToBeRestored:', item);
    this.changeStatus(request, STATUS_0, false);
  }
  

  /** */
  requestToBeTrashed(item, request){
    console.log('requestToBeTrashed:', request.id);
    this.changeStatus(request, request.status, true);
  }


  // ********************************************* //
  async changeStatus(request, STATUS, trash){
    // const isMobile = <boolean> await this.managerService.checkPlatform();
    const isMobile = this.managerService.isMobile;
    console.log(' isMobile----->', isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(isMobile){
      this.changeStatusMobile(request, STATUS, trash);
    } else {
      this.changeStatusBrowser(request, STATUS, trash);
    }
  }

  /** */
  private changeStatusMobile(request, STATUS, trash){
    console.log(' changeStatusMobile ----->');
    const that = this;
    let url = environment.setStatusRequestEndpoint;
    let token = this.managerService.getToken();
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    let calendarId = request.calendarId?request.calendarId:'';
    let eventId = request.eventId?request.eventId:'';
    const params = {
      'request_id': request.id,
      'status': STATUS,
      'trash': trash,
      'calendarId': calendarId,
      'eventId': eventId
    }
    this.http.post(url, params, headers)
    .then(resp => {
      console.log('setStatusRequestEndpoint data: ', JSON.stringify(resp));
      try {
        that.managerService.stopLoader();
        that.BSChangeStatus.next(true);
        setTimeout(() => {
          that.BSChangeStatus.next(null);
        }, 100);
      } catch(error) {
        console.log('error setStatusRequestEndpoint', error);
        that.managerService.stopLoader();
        setTimeout(() => {
          that.BSChangeStatus.next(null);
        }, 100);
      }
    }).catch(error => {
      console.log('error setStatusRequestEndpoint', error);
      that.managerService.stopLoader();
      setTimeout(() => {
        that.BSChangeStatus.next(null);
      }, 100);
    });
  }

  /** */
  private changeStatusBrowser(request, STATUS, trash){
    const that = this;
    let url = environment.setStatusRequestEndpoint;
    // let basicAuth: string = btoa("admin:12345678");
    let token = this.managerService.getToken();
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    let calendarId = request.calendarId?request.calendarId:'';
    let eventId = request.eventId?request.eventId:'';
    const params = new HttpParams()
    .set('request_id', request.id)
    .set('status', STATUS)
    .set('trash', trash)
    .set('calendarId', calendarId)
    .set('eventId', eventId);
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' setStatusRequestEndpoint data: ', JSON.stringify(data));
      that.managerService.stopLoader();
      that.BSChangeStatus.next(true);
      setTimeout(() => {
        that.BSChangeStatus.next(null);
      }, 100);
    }, error => {
      console.log('error setStatusRequestEndpoint', error);
      that.managerService.stopLoader();
      setTimeout(() => {
        that.BSChangeStatus.next(null);
      }, 100);
    });
  }
 


  // ---------------------------------- //
  // httpClient OLD STYLE 
  // ---------------------------------- //
  public getRequestsByIdOld(key:any): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let url = environment.requestsEndpoint + "?id=" + key;
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
