import { Module } from '@nestjs/common';
import { RitualMediaService } from './ritual-media.service';
import { RitualMediaController } from './ritual-media.controller';

@Module({
  controllers: [RitualMediaController],
  providers: [RitualMediaService],
})
export class RitualMediaModule {}
