import { Module } from '@nestjs/common';
import { PaymentLogService } from './payment-log.service';
import { PaymentLogController } from './payment-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/shared/redis/redis.module';
import { PaymentLog } from './entities/payment-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentLog], 'postgresql'), RedisModule],
  controllers: [PaymentLogController],
  providers: [PaymentLogService],
})
export class PaymentLogModule {}
