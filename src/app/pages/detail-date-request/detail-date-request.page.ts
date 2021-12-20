import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, NavController } from '@ionic/angular';

import { ManagerService } from '../../services/manager.service';
import { DateRequestManagerService } from '../../services/date-request-manager.service';
import { DateRequestModel } from '../../models/date-request';

import { 
  MSG_DATE_REQUEST, 
  MSG_ADD_EVENT_OK,
  MSG_ADD_EVENT_KO, 
  MSG_AUTH_OK, 
  MSG_AUTH_KO,
  MSG_GENERIC_OK,
  MSG_GENERIC_KO,
  STATUS_0, 
  STATUS_200,
  ARRAY_STATUS_DATE_REQUEST,
  TIME_MINUTES_APPOINTMENT
} from '../../utils/constants';

import { formatFromDateToString, addTimeToDate, creationDate, formatDate } from '../../utils/utils';
import { AuthenticationService } from '../../services/authentication.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-detail-date-request',
  templateUrl: './detail-date-request.page.html',
  styleUrls: ['./detail-date-request.page.scss'],
})


export class DetailDateRequestPage implements OnInit {

  @ViewChild('dateTime') sTime;

  private subscriptions = [];
  public googleToken: string;
  private idCalendar = environment.googleIdCalendar;
  private keyRequest: string;
  public btnCalendario: string;
  public request: DateRequestModel;

  public startDateTime: string;
  public endDateTime: string;
  // public day: string;
  // public numberDay: string;
  // public month: string;
  // public year: string;
  public timeRequest: string;
  public stringAppointmentDate: string;
  public recapAppointment: string;
  
  STATUS_0 = STATUS_0; // in attesa di risposta
  STATUS_200 = STATUS_200; // in attesa di pagamento
  
  // ion-datetime config ------------- //
  public ionDatetime: string;
  public datetimeDisplayFormat: string;
  public datetimePickerFormat: string;
  public datetimeDisplayTimezone: string;
  public datetimeDayShortNames: (string)[];
  public dateMonthShortNames: (string)[];
  public datetimeToday: string;
  public datetimeEndDate: string;
  public datetimeMinuteValues: string;
  public datetimeDoneText: string;
  public datetimeCancelText: string;

  customPickerOptions: any; 
  // ---------------------------------- //

  constructor(
    private requestManagerService : DateRequestManagerService,
    private activatedRoute: ActivatedRoute,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public authenticationService: AuthenticationService,
    public managerService: ManagerService,
    public alertController: AlertController
  ) { }

  
  
  /** */
  ngOnInit() {
    this.keyRequest = this.activatedRoute.snapshot.paramMap.get('id');
    // this.googleToken = this.managerService.getGToken();
    // this.authenticationService.loadGoogleToken().then(res => {
    //   this.googleToken = res;
    //   console.log('this.googleToken: ', this.googleToken);
    // });
    this.btnCalendario = "Aggiungi al calendario";
    this.initSubscriptions();


    // this.customPickerOptions = {  
    //   buttons: [{  
    //     text: 'SALVA',  
    //     handler: () => {
    //       console.log('3-------> '+this.ionDatetime);
    //       // --> wil contains $event.day.value, $event.month.value and $event.year.value
    //       this.initDateRequest(this.ionDatetime, '');
    //       //this.ionDatetime = this.stringAppointmentDate;
    //       console.log ('Clicked Save');
    //     } 
    //   }, {  
    //     text: 'ANNULLA',  
    //     handler: () => {  
    //       console.log ('Clicked Log. Do not Dismiss.');  
    //       //return false;  
    //     }  
    //   }], 
    // }

  }

  /** */
  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.requestManagerService.getDateRequestById(this.keyRequest);
  }

  /** */
  private initSubscriptions() {
    let subscribtionKey = '';
    let subscribtion: any;
    const that = this;


    /** */
    
    subscribtionKey = 'BSAddCalendarEvent';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      // console.log('***** BSAddCalendarEvent *****', this.requestManagerService.BSAddCalendarEvent);
      subscribtion = this.requestManagerService.BSAddCalendarEvent.subscribe((data: any) => {
        console.log('***** BSAddCalendarEvent *****', JSON.stringify(data));
        if (data != null && data.success == false) {
          that.presentAlertResponse(MSG_ADD_EVENT_KO, false);
        } else if (data != null && data.success == true) {
          // that.presentAlertResponse(MSG_ADD_EVENT_OK, true);
          that.requestUpdate(data.id);
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }

    subscribtionKey = 'BSRemoveCalendarEvent';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      // console.log('***** BSRemoveCalendarEvent *****', this.requestManagerService.BSRemoveCalendarEvent);
      subscribtion = this.requestManagerService.BSRemoveCalendarEvent.subscribe((data: any) => {
        console.log('***** BSRemoveCalendarEvent *****', data);
        if (data != null && data == true) {
          that.presentAlertResponse(MSG_GENERIC_OK, true);
          //that.requestManagerService.getDateRequestById(this.keyRequest);
        } else if (data != null && data == false) {
          that.presentAlertResponse(MSG_GENERIC_KO, true);
          //that.requestManagerService.getDateRequestById(this.keyRequest);
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }


    /** */
    subscribtionKey = 'BSRequestByID';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      // console.log('***** BSRequestByID *****', this.requestManagerService.BSRequestByID);
      subscribtion =  this.requestManagerService.BSRequestByID.subscribe((data: any) => {
        console.log('***** BSRequestByID XXX *****', JSON.stringify(data));

        if (data != null && data) {
          that.request = data as DateRequestModel;
          if(!that.request.data_desiderata || that.request.data_desiderata == undefined){
            that.request.data_desiderata = '';
          }
          if(!that.request.ora_desiderata || that.request.ora_desiderata == undefined){
            that.request.ora_desiderata = '';
          }
          that.initDateRequest(that.request.data_desiderata, that.request.ora_desiderata);
          that.initDatetime();
          that.initAppointment();
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }


    /** */
    // subscribtionKey = 'isGoogleToken';
    // subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    // if (!subscribtion) {
    //   subscribtion = this.authenticationService.isGoogleToken.subscribe((data: any) => {
    //     console.log('***** isGoogleToken *****', data);
    //     if (data != null && data == false) {
    //       console.log('***** isGoogleToken ***** FLASE');
    //       that.presentAlertResponse(MSG_AUTH_KO, false);
    //       that.googleToken = null;
    //       that.authenticationService.signOutSocial();
    //     } else if (data != null && data == true) {
    //       console.log('***** isGoogleToken ***** TRUE');
    //       // that.presentAlertResponse(MSG_AUTH_OK, true);
    //       that.authenticationService.loadGoogleToken().then(res => {
    //         that.googleToken = res;
    //         console.log('***** that.googleToken *****', that.googleToken);
    //       });
    //       // that.googleToken = this.managerService.getGToken();
    //     }
    //   });
    //   const subscribe = {key: subscribtionKey, value: subscribtion };
    //   this.subscriptions.push(subscribe);
    // }

    /** BSGetEmailTemplates */
    subscribtionKey = 'BSChangeDateStatus';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      subscribtion =  this.requestManagerService.BSChangeDateStatus.subscribe((data: any) => {
        console.log('***** BSChangeDateStatus *****', JSON.stringify(data));
        if (data != null && data.success == true) {
          // that.presentAlertResponse(MSG_ADD_EVENT_OK, true);
          // that.requestManagerService.getDateRequestById(that.keyRequest);
          // !!! LEGGI invio email se lo stato è quello corretto mi sembra 200!!!
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }


    /** BSRequestUpdate */
    subscribtionKey = 'BSRequestUpdate';
    subscribtion = this.subscriptions.find(item => item.key === subscribtionKey);
    if (!subscribtion) {
      console.log('***** ADD - BSRequestUpdate *****');
      subscribtion =  this.requestManagerService.BSRequestUpdate.subscribe((data: any) => {
        console.log('***** 2 - BSRequestUpdate *****', JSON.stringify(data));
        if (data != null && data.success == true) {
          //that.presentAlertResponse(MSG_ADD_EVENT_OK, true);
          console.log('***** TRUE BSRequestUpdate *****', data.success);
          that.presentAlertResponse(MSG_ADD_EVENT_OK, true);
          that.requestManagerService.changeStatus(that.request, STATUS_200, false);
        } else if (data != null) {
          console.log('***** FALSE BSRequestUpdate *****');
          that.presentAlertResponse(MSG_GENERIC_KO, false);
          that.requestManagerService.changeStatus(that.request, STATUS_0, false);
          that.removeEventToCalendar();
        }
      });
      const subscribe = {key: subscribtionKey, value: subscribtion };
      this.subscriptions.push(subscribe);
    }

    console.log("sottoscrizioni: ",this.subscriptions);
  }


  /** */
  initDateRequest(appointmentDate, timeDate){
    console.log ('appointmentDate : '+appointmentDate);
    this.startDateTime  = creationDate(appointmentDate, timeDate);
    this.endDateTime  = addTimeToDate(this.startDateTime, '', 0, 0, TIME_MINUTES_APPOINTMENT);
    let dateAppointment = creationDate(this.startDateTime, '', 'dddd, D MMM YYYY');
    let startTime  = formatDate(this.startDateTime, 'HH:mm');
    let endTime = formatDate(this.endDateTime, 'HH:mm');
    this.stringAppointmentDate = dateAppointment + " dalle "+ startTime + " alle " + endTime;
    console.log ('initDateRequest : '+this.stringAppointmentDate);
    let data_desiderata  = formatDate(this.startDateTime, 'YYYY-MM-DD');
    this.request.ora_desiderata = startTime;
    this.request.data_desiderata = data_desiderata;
  }

  /** */
  initDatetime(){
    //this.ionDatetime = new Date(this.request.data_desiderata).toLocaleString("it-IT");//.toLocaleTimeString("it-IT", {timeZone: "Europe/Rome"});
    var isoDate = creationDate(this.request.data_desiderata, this.request.ora_desiderata, "YYYY-MM-DDThh:mmZ"); //, "YYYY-MM-DDThh:mmTZD"
    // this.ionDatetime = formatDate(this.request.data_desiderata, "YYYY-MM-DD H:mm:ssZ"); //, 'YYYY-MM-DDThh:mmTZD'
    // this.ionDatetime = new Date(this.request.data_desiderata).toLocaleTimeString('YYYY-MM-DDThh:mmTZD'); //'dddd DD MMM YYYY HH:mm'
    // this.ionDatetime = new Date(dataX).toLocaleTimeString('YYYY-MM-DDThh:mmTZD');
  
    this.ionDatetime = new Date(isoDate).toISOString();
    console.log("1-----------> ",isoDate);
    console.log("2-----------> ",this.ionDatetime);
     //sabato 09 ott 2021 02:00
    this.datetimeDisplayFormat = "DDD, DD MMM YYYY HH:mm";
    this.datetimePickerFormat = "DD MMM YYYY HH:mm";
    this.datetimeDisplayTimezone = "UTC";
    this.dateMonthShortNames = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
    this.datetimeDayShortNames = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    this.datetimeToday = formatDate(new Date()); // new Date().toLocaleTimeString("it-IT", {timeZone: "Europe/Rome"});
    this.datetimeEndDate = addTimeToDate(this.datetimeToday, '', 730, 0, 0);
    this.datetimeMinuteValues = "0, 30";
    this.datetimeDoneText = "CONFERMA";
    this.datetimeCancelText = "ANNULLA";
  }

  /** */
  initAppointment(){
    this.timeRequest = formatFromDateToString(this.request.time);
    this.recapAppointment =  "Appuntamento con "+this.request.nome+" indirizzo email: "+this.request.email+" presso la sede di "+this.request.sede + ". La richiesta è pervenuta il "+this.timeRequest+" dall'indirizzo "+this.request.source_url; 
    console.log('requestManagerService ***** BSRequestByID *****', this.request);
  }


  /** */
  async presentAlertResponse(msg, success) {
    const alert = await this.alertController.create({
      message: msg
    });
    alert.dismiss();
    await alert.present();
    setTimeout(()=>{
      alert.dismiss().then(() => {
        if (success == true) {
          // this.requestManagerService.getDateRequestById(this.keyRequest);
        } else {
          // this.requestManagerService.getDateRequestById(this.keyRequest);
        }
      });
    }, 3000);
  }


  /**
   * updateRequest 
   * chiamato da BSChangeCalendarEvent
   * che scatta dopo aver aggiunto un evento a google calendar
   * 
   * completo request con i dati dell'evento aggiunto a googlecalendar idEventCalendar e idCalendar
   * cambio lo stato della request (200)
   * cambio label della request ('appuntamento fissato')
   * chiamo API per aggiornare dati form eventualmente cambiati (data appuntamento ecc...)
   */
   requestUpdate(idEventCalendar?){
    console.log('updateRequest:::'+idEventCalendar);
    this.request.eventId = idEventCalendar;
    this.request.calendarId = this.idCalendar;
    this.request.status = STATUS_200;
    this.managerService.checkRequestStatus(this.request, ARRAY_STATUS_DATE_REQUEST);
    this.requestManagerService.requestUpdate(this.request, STATUS_200, false);
    // this.requestManagerService.requestToBeAddedToCalendar(this.request);
  }

  /** */
  updateDate(){
    console.log('4-------> '+this.ionDatetime);
    this.initDateRequest(this.ionDatetime, '');
  }

  /** */
  openStart(){
    this.sTime.open();
    console.log('openStart');
  }

  callNumber(telefono){
    window.open('tel:' + telefono, '_system');
  }

  openEmail(email){
    window.open('mailto:' + email, '_blank')
  }
  

  // -------------------------------- //
  // GOOGLE CALENDAR 
  // -------------------------------- //

  /** */
  addDateToCalendar(){
    //let format = "YYYY-MM-DDTHH:mm:ss";
    let startDateTime  = creationDate(this.startDateTime);
    //let endDateTime  = creationDate(this.endDateTime);
    let endDateTime  = addTimeToDate(startDateTime, '', 0, 0, TIME_MINUTES_APPOINTMENT);
    // console.log('endDateTime: ', endDateTime);
    let description =  "Appuntamento con "+this.request.nome+" indirizzo email: "+this.request.email+" presso la sede di "+this.request.sede + ". La richiesta è pervenuta il "+this.timeRequest+" dall'indirizzo "+this.request.source_url; 
    let event = {
      "summary":  MSG_DATE_REQUEST,
      "location": this.request.sede,
      "description": description,
      "start": {
        "dateTime": startDateTime,
        "timeZone": "Europe/Rome"
      },
      "end": {
        "dateTime": endDateTime,
        "timeZone": "Europe/Rome"
      },
      "recurrence": ["RRULE:FREQ=DAILY;COUNT=1"]
    }
    // let event2 = "{\n  \"summary\": \"Google I/O 2015\",\n  \"location\": \"800 Howard St., San Francisco, CA 94103\",\n  \"description\": \"A chance to hear more about Google\\'s developer products.\",\n  \"start\": {\n    \"dateTime\": \"2021-10-12T09:00:00-07:00\",\n    \"timeZone\": \"America/Los_Angeles\"\n  },\n  \"end\": {\n    \"dateTime\": \"2021-10-12T17:00:00-07:00\",\n    \"timeZone\": \"America/Los_Angeles\"\n  },\n  \"recurrence\": [\n    \"RRULE:FREQ=DAILY;COUNT=2\"\n  ]\n}";
    this.requestManagerService.addEventToCalendar(this.googleToken, this.idCalendar, event);
  }

  /** */
  removeEventToCalendar(){
    console.log('removeEventToCalendar:: ', this.request.eventId);
    this.requestManagerService.deleteEventToCalendar(this.idCalendar, this.request.eventId);
  }


  goToCalendar(){
    let url = "https://calendar.google.com/calendar/embed?src="+environment.googleIdCalendar+"&ctz=Europe%2FRome";
    window.open(url,"_system", "location=yes");
  }
  

  
  /** */
  removeDateToCalendar(){  
  }

  /** */
  modifyDateToCalendar(){
  }

  /** */
  signInWithGoogle(): void {
    this.authenticationService.signInWithGoogle();
  }
  // -------------------------------- //



  // -------------------------------- //
  // NAV FUNCTIONS 
  // -------------------------------- //

  /** */
  ngOnDestroy() {
    console.log('UserPresenceComponent - ngOnDestroy');
    this.unsubescribeAll();
  }

  /** */
  goBack(): void {
    this.navCtrl.back();
  }

  /** */
  private unsubescribeAll() {
    console.log('unsubescribeAll: ', this.subscriptions);
    this.subscriptions.forEach(subscription => {
      subscription.value.unsubscribe(); // vedere come fare l'unsubscribe!!!!
    });
    this.subscriptions = [];
  }

}
