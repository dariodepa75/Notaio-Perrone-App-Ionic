import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateRequestsPage } from './date-requests.page';
import { DateRequestComponentModule } from '../../components/date-request/date-request.module';

describe('DateRequestsPage', () => {
  let component: DateRequestsPage;
  let fixture: ComponentFixture<DateRequestsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRequestsPage ],
      imports: [IonicModule.forRoot(), DateRequestComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DateRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
