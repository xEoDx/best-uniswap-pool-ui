import { TestBed } from '@angular/core/testing';

import { UniswapDataFetcherService } from './uniswap-data-fetcher.service';

describe('UniswapDataFetcherService', () => {
  let service: UniswapDataFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniswapDataFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
