import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { UserSubscription } from './entities/user-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterUserSubsciptionDto } from './dto/filter-user-subscription.dto';

@Injectable()
export class UserSubscriptionService extends BaseService<UserSubscription> {
  constructor(
    @InjectRepository(UserSubscription, 'postgresql')
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    private readonly redisService: RedisService,
  ) {
    super(userSubscriptionRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['user', 'subscriptionPlan', 'payment'];
  }

  protected getSearchableFields(): string[] {
    return [];
  }

  protected createQueryBuilder(
    filters: FilterUserSubsciptionDto,
  ): SelectQueryBuilder<UserSubscription> {
    const queryBuilder = this.userSubscriptionRepository
      .createQueryBuilder('userSubscription')
      .where('userSubscription.deletedAt IS NULL');

    if (filters?.userId) {
      queryBuilder.andWhere('userSubscription.userId = :userId', {
        userId: filters.userId,
      });
    }

    if (filters?.subscriptionPlanId) {
      queryBuilder.andWhere(
        'userSubscription.subscriptionPlanId = :subscriptionPlanId',
        { subscriptionPlanId: filters.subscriptionPlanId },
      );
    }

    if (filters?.status) {
      queryBuilder.andWhere('userSubscription.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.autoRenew !== undefined) {
      queryBuilder.andWhere('userSubscription.autoRenew = :autoRenew', {
        isActive: filters.autoRenew,
      });
    }

    return queryBuilder;
  }
}
