import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RequestModel } from '../models/request';
import { ManagerService } from './manager.service';

// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RemoteService {
  endpoint = 'https://notaioperrone.it/API/requestsJson.php';//'https://jsonplaceholder.typicode.com/todos/1';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  // private response: [];
  public requests: RequestModel[] = [];
  public requestSelected: RequestModel;

  isShowingLoader = false;
  loader: any;

  //public getApiUrl : string = "https://notaioperrone.it/API/connect.php";

  constructor(
    private httpClient: HttpClient,
    public managerService: ManagerService,
    public loadingController: LoadingController,
  ) { }

  getRequests(): Observable<any> {
    return this.httpClient.get<any>(this.endpoint, this.httpOptions)
    .pipe(
      map((data:any ) => {
        /* do something with data */ 
        this.requests = data;
        this.managerService.setRequests(data);
        console.log('response!', this.requests);
        return this.requests;
        }
      ),
      // tap(data => /* does something, but it does not reflect to the data in the subscribe? */
      //   console.log('requests retrieved!', data)
      // ),
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


  public selectRequestsById(key:any) {
    console.log('selectRequestsById', key);
    this.requests = this.managerService.getRequests();
    if(this.requests && this.requests.length > 0 ){
      let index = this.requests.findIndex(i => i.id === key);
      console.log('--->', this.requests[index]);
      this.requestSelected = this.requests[index];
      return this.requestSelected;
    }
  }
  

  public getRequestsById(key:any): Observable<any> {
    let url = this.endpoint + "?id=" + key;
    return this.httpClient.get<any>(url, this.httpOptions)
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



  // ---------------------------------- //
  async showLoader() {
    if (!this.isShowingLoader) {
      this.isShowingLoader = true
      this.loader = await this.loadingController.create({
        message: 'Please wait',
        duration: 4000
      });
      return await this.loader.present();
    }
  }
  async stopLoader() {
    if (this.loader) {
      this.loader.dismiss()
      this.loader = null
      this.isShowingLoader = false
    }
  }

  
  // loadRequestsForm() {
  //   return this.httpClient.get(this.endpoint, this.httpOptions)
  //     .toPromise()
  //     .then(data => {
  //       this.response = data;
  //       console.log('----------------------------------> loadRequestsForm:');
  //       console.log(this.response);
  //     }).catch(err => {
  //       console.log('error loadAppConfig' + err);
  //     });
  // }

  // async getData() {
  //   try {

  //     const params = {};
  //     const headers = {};

  //     const response = await this.httpClient.get(this.endpoint, this.httpOptions);

  //     console.log("---------------------->1"+response);
  //     console.log(response);

  //   } catch (error) {
  //     console.log("---------------------->2"+error);
  //     console.error(error.status);
  //     console.error(error.error); // Error message as string
  //     console.error(error.headers);
  //   }
  // }


  // getCannedResponses(){    
  //   return this.httpClient.get(this.endpoint, this.httpOptions)
  // }

}
