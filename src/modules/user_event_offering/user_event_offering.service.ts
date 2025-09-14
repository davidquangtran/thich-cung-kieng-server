import { Injectable } from '@nestjs/common';
import { CreateUserEventOfferingDto } from './dto/create-user_event_offering.dto';
import { UpdateUserEventOfferingDto } from './dto/update-user_event_offering.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEventOffering } from './entities/user_event_offering.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { BaseService } from 'src/common/base/service/service.base';

@Injectable()
export class UserEventOfferingService extends BaseService<UserEventOffering> {
  constructor(
    @InjectRepository(UserEventOffering, 'postgresql')
    private readonly userEventOfferingRepository: Repository<UserEventOffering>,
    private readonly redisService: RedisService,
  ) {
    super(userEventOfferingRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['userEventId', 'offeringName'];
  }

  protected getDefaultRelations(): string[] {
    return ['userEvent'];
  }

  protected getSearchableFields(): string[] {
    return ['offeringName', 'note'];
  }

  protected createQueryBuilder(
    keyword?: string,
    filters?: Record<string, any>,
  ): SelectQueryBuilder<UserEventOffering> {
    const queryBuilder = this.userEventOfferingRepository
      .createQueryBuilder('userEventOffering')
      .where('userEventOffering.deletedAt IS NULL');

    if (keyword) {
      const searchableFields = this.getSearchableFields();
      if (searchableFields.length > 0) {
        const searchConditions = searchableFields
          .map((field) => `userEventOffering.${field} ILIKE :keyword`)
          .join(' OR ');
        queryBuilder.andWhere(`(${searchConditions})`, {
          keyword: `%${keyword}%`,
        });
      }
    }

    if (filters?.userEventId) {
      queryBuilder.andWhere('userEventOffering.userEventId = :userEventId', {
        userEventId: filters.userEventId,
      });
    }

    if (filters?.offeringName) {
      queryBuilder.andWhere(
        'userEventOffering.offeringName ILIKE :offeringName',
        {
          offeringName: `%${filters.offeringName}%`,
        },
      );
    }

    return queryBuilder;
  }
}
