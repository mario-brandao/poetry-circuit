import { TestBed } from '@angular/core/testing';

import { MobileLogsService } from './mobile-logs.service';

describe('MobileLogsService', () => {
  let service: MobileLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
