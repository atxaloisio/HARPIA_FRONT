import { TestBed, inject } from '@angular/core/testing';

import { PostoTrabalhoService } from './postotrabalho.service';

describe('PostoTrabalhoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostoTrabalhoService]
    });
  });

  it('should be created', inject([PostoTrabalhoService], (service: PostoTrabalhoService) => {
    expect(service).toBeTruthy();
  }));
});
