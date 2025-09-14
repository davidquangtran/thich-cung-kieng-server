import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { RitualReview } from './entities/ritual-review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterRitualReviewDto } from './dto/filter-ritual-review.dto';

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

  protected createQueryBuilder(
    filter: FilterRitualReviewDto,
  ): SelectQueryBuilder<RitualReview> {
    const queryBuilder =
      this.ritualReviewRepository.createQueryBuilder('ritualReview');

    // Apply soft delete filter by default
    queryBuilder.andWhere('ritualReview.deletedAt IS NULL');

    // Apply filters if provided
    if (filter.comment) {
      queryBuilder.andWhere('ritualReview.comment ILIKE :comment', {
        comment: `%${filter.comment}%`,
      });
    }

    if (filter.rating) {
      queryBuilder.andWhere('ritualReview.rating = :rating', {
        rating: filter.rating,
      });
    }

    if (filter.ritualId) {
      queryBuilder.andWhere('ritualReview.ritualId = :ritualId', {
        ritualId: filter.ritualId,
      });
    }

    if (filter.userId) {
      queryBuilder.andWhere('ritualReview.userId = :userId', {
        userId: filter.userId,
      });
    }

    return queryBuilder;
  }
}
