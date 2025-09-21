import { Injectable } from '@nestjs/common';
import { CreateOfferingRitualDto } from './dto/create-offering-ritual.dto';
import { UpdateOfferingRitualDto } from './dto/update-offering-ritual.dto';
import { OfferingRitual } from './entities/offering-ritual.entity';
import { BaseService } from 'src/common/base/service/service.base';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfferingRitualService extends BaseService<OfferingRitual> {
  constructor(
    @InjectRepository(OfferingRitual, 'postgresql')
    private readonly offeringRitualRepository: Repository<OfferingRitual>,
    private readonly redisService: RedisService,
  ) {
    super(offeringRitualRepository, redisService);
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
  ): SelectQueryBuilder<OfferingRitual> {
    const aliasName = OfferingRitual.name.toLowerCase();
    const queryBuilder =
      this.offeringRitualRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    return queryBuilder;
  }
}
