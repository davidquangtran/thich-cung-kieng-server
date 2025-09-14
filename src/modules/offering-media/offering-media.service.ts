import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { OfferingMedia } from './entities/offering-media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterOfferingMediaDto } from './dto/filter-offering-media.dto';

@Injectable()
export class OfferingMediaService extends BaseService<OfferingMedia> {
  constructor(
    @InjectRepository(OfferingMedia, 'postgresql')
    private readonly offeringMediaRepository: Repository<OfferingMedia>,
    private readonly redisService: RedisService,
  ) {
    super(offeringMediaRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['offering'];
  }

  protected getSearchableFields(): string[] {
    return ['url', 'alt'];
  }

  protected createQueryBuilder(
    filter: FilterOfferingMediaDto,
  ): SelectQueryBuilder<OfferingMedia> {
    const queryBuilder =
      this.offeringMediaRepository.createQueryBuilder('offeringmedia');

    // Apply soft delete filter by default
    queryBuilder.andWhere('offeringmedia.deletedAt IS NULL');

    // Apply filters if provided
    if (filter.url) {
      queryBuilder.andWhere('offeringmedia.url ILIKE :url', {
        url: `%${filter.url}%`,
      });
    }

    if (filter.alt) {
      queryBuilder.andWhere('offeringmedia.alt ILIKE :alt', {
        alt: `%${filter.alt}%`,
      });
    }

    if (filter.type) {
      queryBuilder.andWhere('offeringmedia.type = :type', {
        type: filter.type,
      });
    }

    if (filter.offeringId) {
      queryBuilder.andWhere('offeringmedia.offeringId = :offeringId', {
        offeringId: filter.offeringId,
      });
    }

    return queryBuilder;
  }
}
