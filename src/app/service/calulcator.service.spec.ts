import { TestBed } from '@angular/core/testing';

import { CalulcatorService } from './calulcator.service';

describe('CalulcatorService', () => {
  let service: CalulcatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalulcatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
