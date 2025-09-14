import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { PaymentLog } from './entities/payment-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterPaymentLogDto } from './dto/filter-payment-log.dto';

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

  protected createQueryBuilder(
    filter: FilterPaymentLogDto,
  ): SelectQueryBuilder<PaymentLog> {
    const queryBuilder =
      this.paymentLogRepository.createQueryBuilder('paymentlog');

    // Apply soft delete filter by default
    queryBuilder.andWhere('paymentLog.deletedAt IS NULL');

    // Apply filters if provided
    if (filter.oldStatus) {
      queryBuilder.andWhere('paymentLog.oldStatus = :oldStatus', {
        old_status: filter.oldStatus,
      });
    }

    if (filter.newStatus) {
      queryBuilder.andWhere('paymentLog.newStatus = :newStatus', {
        new_status: filter.newStatus,
      });
    }

    if (filter.paymentId) {
      queryBuilder.andWhere('paymentLog.paymentId = :paymentId', {
        paymentId: filter.paymentId,
      });
    }

    return queryBuilder;
  }
}
