import { TestBed } from '@angular/core/testing';

import { NxgChaosEngineeringService } from './nxg-chaos-engineering.service';

describe('NxgChaosEngineeringService', () => {
  let service: NxgChaosEngineeringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NxgChaosEngineeringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
