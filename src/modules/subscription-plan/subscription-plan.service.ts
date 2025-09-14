import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class SubscriptionPlanService extends BaseService<SubscriptionPlan> {
  constructor(
    @InjectRepository(SubscriptionPlan, 'postgresql')
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    private readonly redisService: RedisService,
  ) {
    super(subscriptionPlanRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return ['userSubscriptions', 'planFeatures'];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description'];
  }
}
