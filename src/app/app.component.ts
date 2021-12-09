import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManagerService } from './services/manager.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

import { Platform, AlertController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private isAuthenticated = new BehaviorSubject(null);
  public versionApp: String;
  public appPages = [
    { title: 'Consulenze', url: 'home', icon: 'mail' },
    { title: 'In attesa di pagamento', url: 'pending-payment-request', icon: 'card' },
    { title: 'Appuntamenti', url: '/date-requests', icon: 'time' },
    { title: 'Archiviati', url: '/archived', icon: 'archive' },
    { title: 'Cestino', url: '/trashed', icon: 'trash' },
    { title: 'Calendario', link:environment.urlGoogleCalendar, icon: 'calendar' },
    { title: 'Log-out', url: '/login', icon: 'person' },
  ];

  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public managerService: ManagerService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private platform: Platform, 
    // private statusBar: StatusBar, 
    // private oneSignal: OneSignal,
    // private alertCtrl: AlertController
    // splashScreen: SplashScreen
  ) {}

  ngOnInit() {
    this.initializeApp();
  }

  /** */
  initializeApp() {
    this.versionApp = environment.versionApp;
    this.initSubscriptions();
    this.managerService.checkPlatform();
    this.authenticationService.loadToken();

    this.platform.ready().then(() => {
    });
  }

  /** */
  private initSubscriptions() {
    this.authenticationService.isAuthenticated.subscribe((data: any) => {
      console.log('***** isAuthenticated *****', data);
      if (data != null && data == false) {
        console.log('***** login *****');
        //this.managerService.setToken(this.authenticationService.token);
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else if (data != null && data == true) {
        console.log('***** home *****');
        this.managerService.setToken(this.authenticationService.token);
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });
  }


  // setupPush() {
  //   // I recommend to put these into your environment.ts
  //   this.oneSignal.startInit(environment.ONESIGNAL_APP_ID, environment.ANDROID_ID);
  //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
 
  //   // Notifcation was received in general
  //   this.oneSignal.handleNotificationReceived().subscribe(data => {
  //     let msg = data.payload.body;
  //     let title = data.payload.title;
  //     let additionalData = data.payload.additionalData;
  //     this.showAlert(title, msg, additionalData.task);
  //   });
 
  //   // Notification was really clicked/opened
  //   this.oneSignal.handleNotificationOpened().subscribe(data => {
  //     // Just a note that the data is a different place here!
  //     let additionalData = data.notification.payload.additionalData;
  //     this.showAlert('Notification opened', 'You already read this before', additionalData.task);
  //   });
 
  //   this.oneSignal.endInit();
  // }
 
  // async showAlert(title, msg, task) {
  //   const alert = await this.alertCtrl.create({
  //     header: title,
  //     subHeader: msg,
  //     buttons: [
  //       {
  //         text: 'Action: ${task}',
  //         handler: () => {
  //           // E.g: Navigate to a specific screen
  //         }
  //       }
  //     ]
  //   })
  //   alert.present();
  // }




  goToCalendar(url){
    window.open(url,"_blank");
  }

//   return new Promise((resolve, reject) => {
//     this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/platform.js', () => {
//         gapi.load('auth2', () => {
//             this.auth2 = gapi.auth2.init(Object.assign(Object.assign({}, this.initOptions), { client_id: this.clientId }));
//             this.auth2
//                 .then(() => {
//                 resolve();
//             })
//                 .catch((err) => {
//                 reject(err);
//             });
//         });
//     });
// });


}


