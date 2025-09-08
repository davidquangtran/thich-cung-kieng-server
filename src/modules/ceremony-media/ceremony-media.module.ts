import { Module } from '@nestjs/common';
import { CeremonyMediaService } from './ceremony-media.service';
import { CeremonyMediaController } from './ceremony-media.controller';

@Module({
  controllers: [CeremonyMediaController],
  providers: [CeremonyMediaService],
})
export class CeremonyMediaModule {}
