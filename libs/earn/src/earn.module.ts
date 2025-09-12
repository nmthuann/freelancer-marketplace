import { Module } from '@nestjs/common';
import { EarnService } from './earn.service';

@Module({
  providers: [EarnService],
  exports: [EarnService],
})
export class EarnModule {}
