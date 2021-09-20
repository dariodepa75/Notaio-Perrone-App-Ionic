import { Component } from '@angular/core';
import { ManagerService } from './services/manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Consulenze', url: 'home', icon: 'mail' },
    { title: 'Appuntamenti', url: '/folder/Outbox', icon: 'calendar' },
    { title: 'Archiviati', url: '/folder/Archived', icon: 'archive' },
    { title: 'Cestino', url: '/folder/Trash', icon: 'trash' },
    { title: 'Profilo', url: '/folder/Spam', icon: 'person' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public managerService: ManagerService
  ) {}

  ngOnInit() {
    this.initializeApp();
  }

  /** */
  initializeApp() {
    this.managerService.checkPlatform();
  }

}
