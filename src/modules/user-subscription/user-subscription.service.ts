import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { UserSubscription } from './entities/user-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

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
}
