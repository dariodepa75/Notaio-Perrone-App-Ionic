import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
// attive in platforms
import { HTTP } from '@ionic-native/http/ngx';
// active in web e dev
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ManagerService } from './manager.service';
import { DateRequestModel } from '../models/date-request';
import { STATUS_0, STATUS_200, STATUS_300 } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class DateRequestManagerService {

  // BehaviorSubject
  public BSChangeDateStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public BSRequestByID: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public dateRequests: DateRequestModel[] = [];
  public dateRequestSelected: DateRequestModel;
  
  // ENDPOINT 
  private dateRequestsEndpoint = 'https://notaioperrone.it/API/dateRequestsJson.php'; //'https://jsonplaceholder.typicode.com/todos/1';
  // private sendMailEndpoint = 'https://notaioperrone.it/API/sendMail.php';
  // private emailTemplateEndpoint = 'https://notaioperrone.it/API/emailTemplate.php';
  // private setQuotationEndpoint = 'https://notaioperrone.it/API/setQuotation.php';
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
  getDateRequestsWithSubcribe(status, trash){
    console.log(' getDateRequestsWithSubcribe----->');
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let httpOptions = {
      headers: headers,
      params: { 'status': status, 'trash': trash }
    };
    return this.httpClient.get<any>(this.dateRequestsEndpoint, httpOptions);
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
    let url = this.dateRequestsEndpoint + "?id=" + key;
    this.httpClient.get<any>(url, httpOptions)
    .subscribe(data => {
      console.log(' getRequestByIdDesktop data: ', data);
      that.managerService.setDateRequestSelected(data);
      that.managerService.stopLoader();
      let requestSelected = that.managerService.getDateRequestSelected();
      that.BSRequestByID.next(requestSelected);
    }, error => {
      that.managerService.stopLoader();
      that.BSRequestByID.next(error);
      console.log('error getRequestsDesktop', error);
    });
  }



  // ---------------------------------- //
  // CHANGE STATUS
  // ---------------------------------- //
  /** */
  requestToBeArchived(item, request){
    console.log('requestToBeArchived:', item);
    this.changeStatus(request.id, STATUS_300, false);
  }

  /** */
  requestToBePrevious(item, request){
    let status = STATUS_0;
    if(request.status == STATUS_300){
      status = STATUS_200;
    } else if(request.status == STATUS_200){
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
    // let basicAuth: string = btoa("admin:12345678");
    let token = this.managerService.getToken();
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + token
    } 
    const params = new HttpParams()
    .set('request_id', requestId)
    .set('status', STATUS)
    .set('trash', trash);
    this.httpClient.post<any>(url, params, {'headers':headers})
    .subscribe(data => {
      console.log(' setStatusRequestEndpoint data: ', data);
      that.BSChangeDateStatus.next(true);
    }, error => {
      console.log('error setStatusRequestEndpoint', error);
    });
  }

}
