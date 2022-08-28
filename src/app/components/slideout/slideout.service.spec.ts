import { TestBed } from '@angular/core/testing';

import { SlideoutService } from './slideout.service';

describe('SlideoutService', () => {
  let service: SlideoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlideoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
