import { TestBed } from '@angular/core/testing';

import { HelmetService } from './helmet.service';

describe('HelmetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelmetService = TestBed.get(HelmetService);
    expect(service).toBeTruthy();
  });
});
