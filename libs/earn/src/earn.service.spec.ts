import { Test, TestingModule } from '@nestjs/testing';
import { EarnService } from './earn.service';

describe('EarnService', () => {
  let service: EarnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarnService],
    }).compile();

    service = module.get<EarnService>(EarnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
