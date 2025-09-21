import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterSubscriptionPlanDto } from './dto/filter-subscription-plan.dto';

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

  protected createQueryBuilder(
    filter: FilterSubscriptionPlanDto,
  ): SelectQueryBuilder<SubscriptionPlan> {
    const aliasName = SubscriptionPlan.name.toLowerCase();
    const queryBuilder =
      this.subscriptionPlanRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    // Apply filters if provided
    if (filter.name) {
      queryBuilder.andWhere(`${aliasName}.name ILIKE :name`, {
        name: `%${filter.name}%`,
      });
    }

    if (filter.description) {
      queryBuilder.andWhere(`${aliasName}.description ILIKE :description`, {
        description: `%${filter.description}%`,
      });
    }

    if (filter.price) {
      queryBuilder.andWhere(`${aliasName}.price = :price`, {
        price: filter.price,
      });
    }

    if (filter.durationDays) {
      queryBuilder.andWhere(`${aliasName}.durationDays = :durationDays`, {
        durationDays: filter.durationDays,
      });
    }

    return queryBuilder;
  }
}
