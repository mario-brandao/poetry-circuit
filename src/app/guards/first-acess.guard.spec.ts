import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { firstAcessGuard } from './first-acess.guard';

describe('firstAcessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => firstAcessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
