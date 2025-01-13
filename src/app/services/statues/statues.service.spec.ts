import { TestBed } from '@angular/core/testing';

import { StatuesService } from './statues.service';

describe('StatuesService', () => {
  let service: StatuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
