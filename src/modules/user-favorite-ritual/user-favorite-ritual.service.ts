import { Injectable } from '@nestjs/common';
import { CreateUserFavoriteRitualDto } from './dto/create-user-favorite-ritual.dto';
import { UpdateUserFavoriteRitualDto } from './dto/update-user-favorite-ritual.dto';
import { UserFavoriteRitual } from './entities/user-favorite-ritual.entity';
import { BaseService } from 'src/common/base/service/service.base';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterUserFavoriteRitualDto } from './dto/filter-user-favorite-ritual.dto';

@Injectable()
export class UserFavoriteRitualService extends BaseService<UserFavoriteRitual> {
  constructor(
    @InjectRepository(UserFavoriteRitual, 'postgresql')
    private readonly userFavoriteRitualRepository: Repository<UserFavoriteRitual>,
    private readonly redisService: RedisService,
  ) {
    super(userFavoriteRitualRepository, redisService);
  }
  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return [];
  }

  protected getSearchableFields(): string[] {
    return [];
  }
  protected createQueryBuilder(
    filter: FilterUserFavoriteRitualDto,
  ): SelectQueryBuilder<UserFavoriteRitual> {
    const queryBuilder =
      this.userFavoriteRitualRepository.createQueryBuilder(
        'userFavoriteRitual',
      );

    // Apply soft delete filter by default
    queryBuilder.andWhere('userFavoriteRitual.deletedAt IS NULL');

    // Apply filters if provided
    if (filter.userId) {
      queryBuilder.andWhere('userFavoriteRitual.userId = :userId', {
        userId: filter.userId,
      });
    }

    if (filter.ritualId) {
      queryBuilder.andWhere('userFavoriteRitual.ritualId = :ritualId', {
        ritualId: filter.ritualId,
      });
    }

    return queryBuilder;
  }
}
