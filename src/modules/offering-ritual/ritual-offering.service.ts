import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RitualOffering } from './entities/ritual-offering.entity';

@Injectable()
export class RitualOfferingService extends BaseService<RitualOffering> {
  constructor(
    @InjectRepository(RitualOffering, 'postgresql')
    private readonly ritualOfferingRepository: Repository<RitualOffering>,
    private readonly redisService: RedisService,
  ) {
    super(ritualOfferingRepository, redisService);
  }
  protected getDuplicateFields(): string[] {
    return ['ritualId', 'offeringId'];
  }
  protected getDefaultRelations(): string[] {
    return ['ritual', 'offering'];
  }
  protected getSearchableFields(): string[] {
    return [];
  }
  protected createQueryBuilder(
    filter: any,
  ): SelectQueryBuilder<RitualOffering> {
    const aliasName = RitualOffering.name.toLowerCase();
    const queryBuilder =
      this.ritualOfferingRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    return queryBuilder;
  }
}
