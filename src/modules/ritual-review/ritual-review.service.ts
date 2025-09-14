import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { RitualReview } from './entities/ritual-review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class RitualReviewService extends BaseService<RitualReview> {
  constructor(
    @InjectRepository(RitualReview, 'postgresql')
    private readonly ritualReviewRepository: Repository<RitualReview>,
    private readonly redisService: RedisService,
  ) {
    super(ritualReviewRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['ritual', 'user'];
  }

  protected getSearchableFields(): string[] {
    return ['comment'];
  }
}
