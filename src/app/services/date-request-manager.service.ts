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

  // ********************************************* //
  /** */
  getDateRequestById(key:any){
    console.log('is mobile: '+ this.managerService.isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(this.managerService.isMobile){
      this.getRequestByIdMobile(key);
    } else {
      this.getDateRequestByIdDesktop(key);
    }
  }

  /** */
  private async getRequestByIdMobile(key) {
    console.log(' getRequestByIdMobile ----->');
    const that = this;
    let url = environment.dateRequestsEndpoint + "?id=" + key;
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
      console.log(' getRequestByIdMobile resp: ', JSON.stringify(resp.data));
      try {
        that.managerService.setDateRequestSelected(JSON.parse(resp.data));
        let requestSelected = that.managerService.getDateRequestSelected();
        that.managerService.stopLoader();
        that.BSRequestByID.next(requestSelected);
        setTimeout(() => {
          that.BSRequestByID.next(null);
        }, 100);
      } catch(error) {
        that.managerService.stopLoader();
        that.BSRequestByID.next(error);
        setTimeout(() => {
          that.BSRequestByID.next(null);
        }, 100);
        console.log('error getRequestsDesktop', error);
        }
    }).catch(error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      setTimeout(() => {
        that.BSRequestByID.next(null);
      }, 100);
      console.log('error getRequestsDesktop', error);
    });
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
      let requestSelected = that.managerService.getDateRequestSelected();
      that.managerService.stopLoader();
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
  // ********************************************* //




  // ********************************************* //
  // ADD EVENT TO CALENDAR // 
  /** */
  async addEventToCalendar(token, idCalendar, event){
    // const isMobile = <boolean> await this.managerService.checkPlatform();
    const isMobile = this.managerService.isMobile;
    console.log(' isMobile----->', isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(isMobile){
      this.addEventToCalendarMobile(idCalendar, event);
    } else {
      this.addEventToCalendarBrowser(idCalendar, event);
    }
  }

  /** */
  private addEventToCalendarMobile(idCalendar, event) {
    console.log(' addEventToCalendarMobile ----->');
    const that = this;
    let url = environment.googleCalendarEndpoint+environment.pgGoogleCalendarInsert;
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    } 
    const params =  {
      'event': event, 
      'calendarId': idCalendar
    };
    console.log('headers', JSON.stringify(headers));
    console.log('params', JSON.stringify(params));
    this.http.post(url, params, headers)
    .then(resp => {
      console.log('response 1: ', JSON.stringify(resp.data));
      try {
        let data = JSON.parse(resp.data);
        console.log(' TEST resp: ', JSON.stringify(data));
        that.managerService.stopLoader();
        that.BSAddCalendarEvent.next(data);
        setTimeout(() => {
          that.BSAddCalendarEvent.next(null);
        }, 100);
      } catch(error) {
        console.error('JSON parsing error');
        that.managerService.stopLoader();
        that.BSAddCalendarEvent.next(error);
        setTimeout(() => {
          that.BSAddCalendarEvent.next(null);
        }, 100);
      }
    }).catch(error => {
      that.managerService.stopLoader();
      that.BSAddCalendarEvent.next(error);
      setTimeout(() => {
        that.BSAddCalendarEvent.next(null);
      }, 100);
      console.log('error TEST', error);
    });
  }

  /** */
  private addEventToCalendarBrowser(idCalendar, event){
    const that = this;
    let url = environment.googleCalendarEndpoint+environment.pgGoogleCalendarInsert;
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    } 
    const params =  {
      'event': event, 
      'calendarId': idCalendar
    };
    this.httpClient.post<any>(url, params, {'headers':headers})
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
  // ********************************************* //
  

  // ********************************************* //
  // ************ removeEventToCalendar ********** //


  /** */
  async deleteEventToCalendar(calendarId, eventId){
    const isMobile = this.managerService.isMobile;
    console.log(' isMobile----->', isMobile);
    this.managerService.stopLoader();
    this.managerService.showLoader();
    if(isMobile){
      this.deleteEventToCalendarMobile(calendarId, eventId);
    } else {
      this.deleteEventToCalendarBrowser(calendarId, eventId);
    }
  }

  /** */
  private deleteEventToCalendarMobile(calendarId, eventId) {
    console.log(' deleteEventToCalendarMobile ----->');
    const that = this;
    let url = environment.googleCalendarEndpoint+environment.pgGoogleCalendarDelete;
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const params = {
      'eventId': eventId, 
      'calendarId': calendarId
    };
    console.log('headers', JSON.stringify(headers));
    console.log('params', JSON.stringify(params));
    this.http.post(url, params, headers)
    .then(resp => {
      console.log('response : ', JSON.stringify(resp.data));
      try {
        let data = JSON.parse(resp.data);
        console.log('deleteEventToCalendarMobile resp: ', JSON.stringify(data));
        that.managerService.stopLoader();
        that.BSRemoveCalendarEvent.next(data);
        setTimeout(() => {
          that.BSRemoveCalendarEvent.next(null);
        }, 100);
      } catch(error) {
        console.error('JSON parsing error');
        that.managerService.stopLoader();
        that.BSRemoveCalendarEvent.next(error);
        setTimeout(() => {
          that.BSRemoveCalendarEvent.next(null);
        }, 100);
      }
    }).catch(error => {
      that.managerService.stopLoader();
      that.BSAddCalendarEvent.next(error);
      setTimeout(() => {
        that.BSAddCalendarEvent.next(null);
      }, 100);
      console.log('error deleteEventToCalendarMobile', JSON.stringify(error));
    });
  }

  /** */
  public deleteEventToCalendarBrowser(calendarId, eventId){
    const that = this;
    let url = environment.googleCalendarEndpoint+environment.pgGoogleCalendarDelete;
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    } 
    const params =  {
      'eventId': eventId, 
      'calendarId': calendarId
    };
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' deleteEventToCalendarBrowser data: ', data);
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
      console.log('error deleteEventToCalendarBrowser', error);
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
    let eventId = request.eventId?request.eventId:'';
    let calendarId = request.calendarId?request.calendarId:'';
    if(eventId && status == STATUS_0){
      this.deleteEventToCalendar(calendarId, eventId);    
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
    let eventId = request.eventId?request.eventId:'';
    let calendarId = request.calendarId?request.calendarId:'';
    if(eventId){
      this.deleteEventToCalendar(calendarId, eventId);
    }
  }
  

  // ********************************************* //
  /** requestUpdate */
  async requestUpdate(request:DateRequestModel, STATUS, trash){
    const isMobile = this.managerService.isMobile;
    this.managerService.stopLoader();
    this.managerService.showLoader();
    console.log(' isMobile----->', isMobile);
    if(isMobile){
      this.requestUpdateMobile(request, STATUS, trash);
    } else {
      this.requestUpdateBrowser(request, STATUS, trash);
    }
  }

  /** */
  private requestUpdateMobile(request:DateRequestModel, STATUS, trash){
    const that = this;
    let url = environment.updateRequestEndpoint;
    let token = this.managerService.getToken();
    const headers = { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    const params = {
      'request': JSON.stringify(request),
      'status': STATUS,
      'trash': trash
    }
    this.http.post(url, params, headers)
    .then(resp => {
      console.log('data requestUpdateMobile: ', JSON.stringify(resp));
      try {
        that.managerService.stopLoader();
        that.BSRequestUpdate.next(JSON.parse(resp.data));
        setTimeout(() => {
          that.BSRequestUpdate.next(null);
        }, 100);
      } catch(error) {
        that.managerService.stopLoader();
        that.BSRequestUpdate.next(false);
        setTimeout(() => {
          that.BSRequestUpdate.next(null);
        }, 100);
      }
    }).catch(error => {
      console.log('error requestUpdateMobile: ', error);
      that.managerService.stopLoader();
      that.BSRequestUpdate.next(false);
      setTimeout(() => {
        that.BSRequestUpdate.next(null);
      }, 100);
    });
  }

  /** */
  private requestUpdateBrowser(request:DateRequestModel, STATUS, trash){
    const that = this;
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
    .subscribe(resp => {
      console.log(' updateRequestEndpoint data: ', resp);
      that.managerService.stopLoader();
      that.BSRequestUpdate.next(resp);
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
  // ********************************************* //

  // ********************************************* // 

  async changeStatus(request, STATUS, trash){
    // const isMobile = <boolean> await this.managerService.checkPlatform();
    this.managerService.stopLoader();
    this.managerService.showLoader();
    const isMobile = this.managerService.isMobile;
    console.log(' isMobile----->', isMobile);
    if(isMobile){
      this.changeStatusMobile(request, STATUS, trash);
    } else {
      this.changeStatusBrowser(request, STATUS, trash);
    }
  }

  /** */
  private changeStatusMobile(request, STATUS, trash){
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
      console.log(' setStatusRequestEndpoint data: ', JSON.stringify(resp));
      try {
        that.managerService.stopLoader();
        that.BSChangeDateStatus.next(true);
        setTimeout(() => {
          that.BSChangeDateStatus.next(null);
        }, 100);
      } catch(error) {
        that.managerService.stopLoader();
        that.BSChangeDateStatus.next(false);
        setTimeout(() => {
          that.BSChangeDateStatus.next(null);
        }, 100);
        console.log('error setStatusRequestEndpoint', error);
      }
    }).catch(error => {
      that.managerService.stopLoader();
      that.BSChangeDateStatus.next(false);
      setTimeout(() => {
        that.BSChangeDateStatus.next(null);
      }, 100);
      console.log('error setStatusRequestEndpoint', error);
    });
  }

  /** */
  private changeStatusBrowser(request:DateRequestModel, STATUS, trash){
    const that = this;
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
      console.log(' setStatusRequestEndpoint data: ', JSON.stringify(data));
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
