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
    const aliasName = Payment.name.toLowerCase();
    const queryBuilder = this.paymentRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    if (filter.status) {
      queryBuilder.andWhere(`${aliasName}.status = :status`, {
        status: filter.status,
      });
    }

    if (filter.provider) {
      queryBuilder.andWhere(`${aliasName}.provider = :provider`, {
        provider: filter.provider,
      });
    }

    if (filter.userId) {
      queryBuilder.andWhere(`${aliasName}.userId = :userId`, {
        userId: filter.userId,
      });
    }

    if (filter.userSubscriptionId) {
      queryBuilder.andWhere(
        `${aliasName}.userSubscriptionId = :userSubscriptionId`,
        {
          userSubscriptionId: filter.userSubscriptionId,
        },
      );
    }

    return queryBuilder;
  }
}
