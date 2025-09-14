import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterPaymentDto } from './dto/filter-payment.dto';

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

  protected createQueryBuilder(
    filter: FilterPaymentDto,
  ): SelectQueryBuilder<Payment> {
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

    // Apply soft delete filter by default
    queryBuilder.andWhere('payment.deletedAt IS NULL');

    if (filter.status) {
      queryBuilder.andWhere('payment.status = :status', {
        status: filter.status,
      });
    }

    if (filter.provider) {
      queryBuilder.andWhere('payment.provider = :provider', {
        provider: filter.provider,
      });
    }

    if (filter.userId) {
      queryBuilder.andWhere('payment.userId = :userId', {
        userId: filter.userId,
      });
    }

    if (filter.userSubscriptionId) {
      queryBuilder.andWhere(
        'payment.userSubscriptionId = :userSubscriptionId',
        {
          userSubscriptionId: filter.userSubscriptionId,
        },
      );
    }

    return queryBuilder;
  }
}
