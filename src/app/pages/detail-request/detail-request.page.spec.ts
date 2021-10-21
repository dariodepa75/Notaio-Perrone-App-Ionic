import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DetailRequestPageRoutingModule } from './detail-request-routing.module';

import { DetailRequestPage } from './detail-request.page';

describe('DetailRequestPage', () => {
  let component: DetailRequestPage;
  let fixture: ComponentFixture<DetailRequestPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestPage ],
      imports: [IonicModule.forRoot(), DetailRequestPageRoutingModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
