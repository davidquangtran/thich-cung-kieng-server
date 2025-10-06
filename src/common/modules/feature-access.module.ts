import { Module } from '@nestjs/common';
import { FeatureAccessService } from 'src/common/services/feature-access.service';
import { UserSubscriptionModule } from 'src/modules/user-subscription/user-subscription.module';
import { FeatureExampleController } from 'src/examples/feature-example.controller';

@Module({
  imports: [UserSubscriptionModule],
  providers: [FeatureAccessService],
  controllers: [FeatureExampleController],
  exports: [FeatureAccessService],
})
export class FeatureAccessModule {}