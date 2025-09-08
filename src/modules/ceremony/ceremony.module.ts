import { Module } from '@nestjs/common';
import { CeremonyService } from './ceremony.service';
import { CeremonyController } from './ceremony.controller';

@Module({
  controllers: [CeremonyController],
  providers: [CeremonyService],
})
export class CeremonyModule {}
