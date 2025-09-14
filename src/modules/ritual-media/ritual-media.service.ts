import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { RitualMedia } from './entities/ritual-media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterRitualMediaDto } from './dto/filter-ritual-media.dto';

@Injectable()
export class RitualMediaService extends BaseService<RitualMedia> {
  constructor(
    @InjectRepository(RitualMedia, 'postgresql')
    private readonly ritualMediaRepository: Repository<RitualMedia>,
    private readonly redisService: RedisService,
  ) {
    super(ritualMediaRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['ritual'];
  }

  protected getSearchableFields(): string[] {
    return ['url', 'alt'];
  }

  protected createQueryBuilder(
    filter: FilterRitualMediaDto,
  ): SelectQueryBuilder<RitualMedia> {
    const queryBuilder =
      this.ritualMediaRepository.createQueryBuilder('ritualMedia');

    // Apply soft delete filter by default
    queryBuilder.andWhere('ritualMedia.deletedAt IS NULL');

    // Apply filters if provided
    if (filter.url) {
      queryBuilder.andWhere('ritualMedia.url ILIKE :url', {
        url: `%${filter.url}%`,
      });
    }

    if (filter.alt) {
      queryBuilder.andWhere('ritualMedia.alt ILIKE :alt', {
        alt: `%${filter.alt}%`,
      });
    }

    if (filter.type) {
      queryBuilder.andWhere('ritualMedia.type = :type', {
        type: filter.type,
      });
    }

    if (filter.ritualId) {
      queryBuilder.andWhere('ritualMedia.ritualId = :ritualId', {
        ritualId: filter.ritualId,
      });
    }

    return queryBuilder;
  }
}
