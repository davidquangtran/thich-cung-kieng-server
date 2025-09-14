import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class PaymentService extends BaseService<Payment> {
  constructor(
    @InjectRepository(Payment, 'postgresql')
    private readonly paymentRepository: Repository<Payment>,
    private readonly redisService: RedisService,
  ) {
    super(paymentRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['user', 'userSubscription', 'paymentLogs'];
  }

  protected getSearchableFields(): string[] {
    return ['currency'];
  }
}
