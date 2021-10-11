import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManagerService } from './services/manager.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private isAuthenticated = new BehaviorSubject(null);

  public appPages = [
    { title: 'Consulenze', url: 'home', icon: 'mail' },
    { title: 'In attesa di pagamento', url: 'pending-payment-request', icon: 'card' },
    { title: 'Appuntamenti', url: '/date-requests', icon: 'calendar' },
    { title: 'Archiviati', url: '/archived', icon: 'archive' },
    { title: 'Cestino', url: '/trashed', icon: 'trash' },
    { title: 'Profilo', url: '/folder/Spam', icon: 'person' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public managerService: ManagerService,
    public authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeApp();
  }

  /** */
  initializeApp() {
    this.initSubscriptions();
    this.managerService.checkPlatform();
    this.authenticationService.loadToken();
  }

  /** */
  private initSubscriptions() {
    this.authenticationService.isAuthenticated.subscribe((data: any) => {
      console.log('***** isAuthenticated *****', data);
      if (!data || data == false) {
        //this.managerService.setToken(this.authenticationService.token);
        this.router.navigateByUrl('/login', { replaceUrl: true });
      } else if (data && data == true) {
        //this.managerService.setToken(this.authenticationService.token);
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
      
    });
  }


}


