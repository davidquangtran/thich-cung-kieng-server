import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { PaymentLog } from './entities/payment-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class PaymentLogService extends BaseService<PaymentLog> {
  constructor(
    @InjectRepository(PaymentLog, 'postgresql')
    private readonly paymentLogRepository: Repository<PaymentLog>,
    private readonly redisService: RedisService,
  ) {
    super(paymentLogRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['payment'];
  }

  protected getSearchableFields(): string[] {
    return ['old_status', 'new_status', 'description'];
  }
}
