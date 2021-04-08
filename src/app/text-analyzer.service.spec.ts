import { TestBed } from '@angular/core/testing';

import { TextAnalyzerService } from './text-analyzer.service';

describe('TextAnalyzerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextAnalyzerService = TestBed.get(TextAnalyzerService);
    expect(service).toBeTruthy();
  });
});
