import { Module } from '@nestjs/common';
import { RitualReviewService } from './ritual-review.service';
import { RitualReviewController } from './ritual-review.controller';

@Module({
  controllers: [RitualReviewController],
  providers: [RitualReviewService],
})
export class RitualReviewModule {}
