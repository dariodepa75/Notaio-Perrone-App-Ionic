import { TestBed } from '@angular/core/testing';

import { DateRequestManagerService } from './date-request-manager.service';

describe('DateRequestManagerService', () => {
  let service: DateRequestManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateRequestManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
