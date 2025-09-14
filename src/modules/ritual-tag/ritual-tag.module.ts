import { Module } from '@nestjs/common';
import { RitualTagService } from './ritual-tag.service';
import { RitualTagController } from './ritual-tag.controller';

@Module({
  controllers: [RitualTagController],
  providers: [RitualTagService],
})
export class RitualTagModule {}
