import { Injectable } from '@nestjs/common';
import { CreateSubscriptionFeatureDto } from './dto/create-subscription-feature.dto';
import { UpdateSubscriptionFeatureDto } from './dto/update-subscription-feature.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionFeature } from './entities/subscription-feature.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { BaseService } from 'src/common/base/service/service.base';

@Injectable()
export class SubscriptionFeatureService extends BaseService<SubscriptionFeature> {
  constructor(
    @InjectRepository(SubscriptionFeature, 'postgresql')
    private readonly subscriptionFeatureRepository: Repository<SubscriptionFeature>,
    private readonly redisService: RedisService,
  ) {
    super(subscriptionFeatureRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return ['planFeatures'];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description'];
  }
}
