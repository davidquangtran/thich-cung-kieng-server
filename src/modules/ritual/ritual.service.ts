import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Ritual } from './entities/ritual.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterRitualDto } from './dto/filter-ritual.dto';

@Injectable()
export class RitualService extends BaseService<Ritual> {
  constructor(
    @InjectRepository(Ritual, 'postgresql')
    private readonly ritualRepository: Repository<Ritual>,
    private readonly redisService: RedisService,
  ) {
    super(ritualRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return ['ritualOfferings', 'ritualOfferings.offering'];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description'];
  }

  protected createQueryBuilder(
    filter: FilterRitualDto,
  ): SelectQueryBuilder<Ritual> {
    const queryBuilder = this.ritualRepository.createQueryBuilder('ritual');

    // Apply soft delete filter by default
    queryBuilder.andWhere('ritual.deletedAt IS NULL');

    if (filter.difficultyLevel) {
      queryBuilder.andWhere('ritual.difficultyLevel = :difficultyLevel', {
        difficultyLevel: filter.difficultyLevel,
      });
    }
    if (filter.timeOfExecution) {
      queryBuilder.andWhere('ritual.timeOfExecution = :timeOfExecution', {
        timeOfExecution: filter.timeOfExecution,
      });
    }
    if (filter.dateSolar) {
      queryBuilder.andWhere('ritual.dateSolar = :dateSolar', {
        dateSolar: filter.dateSolar,
      });
    }
    if (filter.dateLunar) {
      queryBuilder.andWhere('ritual.dateLunar = :dateLunar', {
        dateLunar: filter.dateLunar,
      });
    }
    if (filter.isHot !== undefined) {
      queryBuilder.andWhere('ritual.isHot = :isHot', { isHot: filter.isHot });
    }
    if (filter.ritualCategoryId) {
      queryBuilder.andWhere('ritual.ritualCategoryId = :ritualCategoryId', {
        ritualCategoryId: filter.ritualCategoryId,
      });
    }

    return queryBuilder;
  }
}
