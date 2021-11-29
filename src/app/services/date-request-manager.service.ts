import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// attive in platforms
import { HTTP } from '@ionic-native/http/ngx';
// active in web e dev
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ManagerService } from './manager.service';
import { DateRequestModel } from '../models/date-request';
import { STATUS_0, STATUS_200, STATUS_300 } from '../utils/constants';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DateRequestManagerService {
  private idCalendar = environment.googleIdCalendar;
  // BehaviorSubject
  public BSChangeDateStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSAddCalendarEvent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRemoveCalendarEvent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  public BSRequestByID: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRequestUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  public dateRequests: DateRequestModel[] = [];
  public dateRequestSelected: DateRequestModel;
  
  // ENDPOINT 
  // private dateRequestsEndpoint = 'https://notaioperrone.it/API/dateRequestsJson.php'; //'https://jsonplaceholder.typicode.com/todos/1';
  // private sendMailEndpoint = 'https://notaioperrone.it/API/sendMail.php';
  // private emailTemplateEndpoint = 'https://notaioperrone.it/API/emailTemplate.php';
  // private setQuotationEndpoint = 'https://notaioperrone.it/API/setQuotation.php';
  // private setStatusRequestEndpoint = 'https://notaioperrone.it/API/setStatus.php';
  // private googleCalendarEndpoint = 'https://www.googleapis.com/calendar/v3/calendars/';

  

  constructor(
    public http: HTTP,
    public httpClient: HttpClient,
    public managerService: ManagerService,
    public authenticationService: AuthenticationService
    ) {
  }


  // ---------------------------------- //
  // ELENCO E DETTAGLIO RICHIESTE
  // ---------------------------------- //
  
  /** */
  getDateRequestsWithSubcribe(status, trash){
    console.log(' getDateRequestsWithSubcribe----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let httpOptions = {
      headers: headers,
      params: { 'status': status, 'trash': trash }
    };
    return this.httpClient.get<any>(environment.dateRequestsEndpoint, httpOptions);
  }

  /** */
  getDateRequestById(key:any){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.showLoader();
    if(this.managerService.isMobile){
      // this.getRequestByIdMobile(key);
      this.getDateRequestByIdDesktop(key);
    } else {
      this.getDateRequestByIdDesktop(key);
    }
  }

  /** */
  private getDateRequestByIdDesktop(key:any){
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
    let url = environment.dateRequestsEndpoint + "?id=" + key;
    this.httpClient.get<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' getRequestByIdDesktop data: ', data);
      that.managerService.setDateRequestSelected(data);
      that.managerService.stopLoader();
      let requestSelected = that.managerService.getDateRequestSelected();
      that.BSRequestByID.next(requestSelected);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 100);
    }, error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 100);
      console.log('error getRequestsDesktop', error);
    });
  }



  /** */
  public googleCalendarGetToken(){
    const that = this;
    this.managerService.showLoader();
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
      console.log(' TEST data: ', data);
      that.managerService.stopLoader();
      that.BSAddCalendarEvent.next(data);
      setTimeout(() => {
        that.BSAddCalendarEvent.next(null);
      }, 100);

    }, error => {
      that.managerService.stopLoader();
      that.BSAddCalendarEvent.next(error);
      setTimeout(() => {
        that.BSAddCalendarEvent.next(null);
      }, 100);
      console.log('error TEST', error);
    });
  }


  public addEventToCalendar(token, idCalendar, event){
    const that = this;
    this.managerService.showLoader();
    let url = environment.googleCalendarEndpoint+idCalendar+'/events';
    // https://www.googleapis.com/calendar/v3/calendars/ij22s1gosiq653l7a2m35q6ju8@group.calendar.google.com/events';
    // let basicAuth: string = btoa("admin:12345678");
    // let token = 'ya29.a0ARrdaM8KQjhkBW8E9pHs-kjKTu27OXinUKJoGXkjw86oYcNMwQ2uUASM6HvNOgrnrJfMxWTmRrlurNidqLGobqDVRlPYbdxbPq2rdVu2LZzg6ysEQt4ME-SLFSJuGorQU-dAhFVkMZ-IIvm0GF9KF11gDAgB3-0Z99_sTMg';
    // this.managerService.getToken();
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    // console.log('headers: ', headers);
    this.httpClient.post<any>(url, event, {'headers':headers})
    .subscribe(data => {
      console.log(' TEST data: ', data);
      that.managerService.stopLoader();
      that.BSAddCalendarEvent.next(data);
      setTimeout(() => {
        that.BSAddCalendarEvent.next(null);
      }, 100);

    }, error => {
      that.managerService.stopLoader();
      that.BSAddCalendarEvent.next(error);
      setTimeout(() => {
        that.BSAddCalendarEvent.next(null);
      }, 100);
      console.log('error TEST', error);
    });
  }


  /** */
  public removeEventToCalendar(token, calendarId, eventId){
    const that = this;
    this.managerService.showLoader();
    let url = environment.googleCalendarEndpoint+calendarId+'/events/'+eventId;
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    // console.log('headers: ', headers);
    this.httpClient.delete<any>(url, {'headers':headers})
    .subscribe(data => {
      console.log(' TEST data: ', data);
      that.managerService.stopLoader();
      that.BSRemoveCalendarEvent.next(data);
      setTimeout(() => {
        that.BSRemoveCalendarEvent.next(null);
      }, 100);
    }, error => {
      that.managerService.stopLoader();
      that.BSRemoveCalendarEvent.next(error);
      setTimeout(() => {
        that.BSRemoveCalendarEvent.next(null);
      }, 100);
      console.log('error TEST', error);
    });
  }
  



  // ---------------------------------- //
  // CHANGE STATUS
  // ---------------------------------- //
  /** */
  requestToBeArchived(item, request:DateRequestModel){
    console.log('requestToBeArchived:', item);
    this.changeStatus(request, STATUS_300, false);
  }

  /** */
  requestToBePrevious(item, request:DateRequestModel){
    let status = STATUS_0;
    if(request.status == STATUS_300){
      status = STATUS_200;
    } else if(request.status == STATUS_200){
      status = STATUS_0;
    }
    console.log('requestToBePrevious:', item);
    this.changeStatus(request, status, false);
    // elimina evento da calendario
    let token = this.managerService.getToken();
    let eventId = request.eventId?request.eventId:'';
    if(eventId && status == STATUS_0){
      this.authenticationService.loadGoogleToken().then(googleToken => {
        this.removeEventToCalendar(googleToken, this.idCalendar, eventId);
      });
      
    }
  }

  /** */
  requestToBeRestored(item, request:DateRequestModel){
    console.log('requestToBeRestored:', item);
    this.changeStatus(request, STATUS_0, false);
  }
  
  /** */
  requestToBeTrashed(item, request:DateRequestModel){
    console.log('requestToBeTrashed:', request);
    this.changeStatus(request, request.status, true);
    // elimina evento da calendario
    let token = this.managerService.getToken();
    let eventId = request.eventId?request.eventId:'';
    if(eventId){
      this.authenticationService.loadGoogleToken().then(googleToken => {
        this.removeEventToCalendar(googleToken, this.idCalendar, eventId);
      });
    }
  }
  
  /** */
  // requestToBeAddedToCalendar(request:DateRequestModel){
  //   console.log('requestToBeAddedToCalendar:', request);
  //   console.log(request);
  //   this.requestUpdate(request, request.status, false);
  //   // this.sendEmail(request.id, request.status, false);
  // }

  /** */
  public requestUpdate(request:DateRequestModel, STATUS, trash){
    const that = this;
    this.managerService.showLoader();
    let url = environment.updateRequestEndpoint;
    let token = this.managerService.getToken();
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    const params = new HttpParams()
    .set('request', JSON.stringify(request))
    .set('status', STATUS)
    .set('trash', trash);
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' updateRequestEndpoint data: ', data);
      that.managerService.stopLoader();
      that.BSRequestUpdate.next(data);
      setTimeout(() => {
        that.BSRequestUpdate.next(null);
      }, 100);
    }, error => {
      console.log('error updateRequestEndpoint', error);
      that.managerService.stopLoader();
      that.BSRequestUpdate.next(false);
      setTimeout(() => {
        that.BSRequestUpdate.next(null);
      }, 100);
    });
  }

  /** */
  public changeStatus(request:DateRequestModel, STATUS, trash){
    const that = this;
    this.managerService.showLoader();
    let url = environment.setStatusRequestEndpoint;
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
      console.log(' setStatusRequestEndpoint data: ', data);
      that.managerService.stopLoader();
      that.BSChangeDateStatus.next(true);
      setTimeout(() => {
        that.BSChangeDateStatus.next(null);
      }, 100);
    }, error => {
      that.managerService.stopLoader();
      that.BSChangeDateStatus.next(false);
      setTimeout(() => {
        that.BSChangeDateStatus.next(null);
      }, 100);
      console.log('error setStatusRequestEndpoint', error);
    });
  }

}
