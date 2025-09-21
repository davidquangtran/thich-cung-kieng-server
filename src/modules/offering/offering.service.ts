import { Injectable } from '@nestjs/common';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { Offering } from './entities/offering.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service/service.base';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterOfferingDto } from './dto/filter-offering.dto';

@Injectable()
export class OfferingService extends BaseService<Offering> {
  constructor(
    @InjectRepository(Offering, 'postgresql')
    private readonly offeringRepository: Repository<Offering>,
    private readonly redisService: RedisService,
  ) {
    super(offeringRepository, redisService);
  }
  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return [];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description'];
  }

  protected createQueryBuilder(
    filter: FilterOfferingDto,
  ): SelectQueryBuilder<Offering> {
    const aliasName = Offering.name.toLowerCase();
    const queryBuilder = this.offeringRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    return queryBuilder;
  }
}
