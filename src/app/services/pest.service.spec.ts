import { TestBed } from '@angular/core/testing';

import { PestService } from './pest.service';

describe('PestService', () => {
  let service: PestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
