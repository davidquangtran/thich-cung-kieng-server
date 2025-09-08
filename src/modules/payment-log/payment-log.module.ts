import { Module } from '@nestjs/common';
import { PaymentLogService } from './payment-log.service';
import { PaymentLogController } from './payment-log.controller';

@Module({
  controllers: [PaymentLogController],
  providers: [PaymentLogService],
})
export class PaymentLogModule {}
