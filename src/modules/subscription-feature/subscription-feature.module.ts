import { Module } from '@nestjs/common';
import { SubscriptionFeatureService } from './subscription-feature.service';
import { SubscriptionFeatureController } from './subscription-feature.controller';

@Module({
  controllers: [SubscriptionFeatureController],
  providers: [SubscriptionFeatureService],
})
export class SubscriptionFeatureModule {}
