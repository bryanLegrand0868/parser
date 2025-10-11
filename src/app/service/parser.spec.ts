import { TestBed } from '@angular/core/testing';

import { ParserServicio } from './parser';

describe('Parser', () => {
  let service: ParserServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
