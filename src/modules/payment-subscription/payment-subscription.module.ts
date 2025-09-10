import { Module } from '@nestjs/common';
import { PaymentSubscriptionService } from './payment-subscription.service';
import { PaymentSubscriptionController } from './payment-subscription.controller';

@Module({
  controllers: [PaymentSubscriptionController],
  providers: [PaymentSubscriptionService],
})
export class PaymentSubscriptionModule {}
