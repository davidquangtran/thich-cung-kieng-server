import { Module } from '@nestjs/common';
import { OfferingMediaService } from './offering-media.service';
import { OfferingMediaController } from './offering-media.controller';

@Module({
  controllers: [OfferingMediaController],
  providers: [OfferingMediaService],
})
export class OfferingMediaModule {}
