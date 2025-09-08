import { Module } from '@nestjs/common';
import { CeremonyTagService } from './ceremony-tag.service';
import { CeremonyTagController } from './ceremony-tag.controller';

@Module({
  controllers: [CeremonyTagController],
  providers: [CeremonyTagService],
})
export class CeremonyTagModule {}
