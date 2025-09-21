import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { UserEvent } from './entities/user-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterUserEvent } from './dto/filter-user-event.dto';

@Injectable()
export class UserEventService extends BaseService<UserEvent> {
  constructor(
    @InjectRepository(UserEvent, 'postgresql')
    private readonly userEventRepository: Repository<UserEvent>,
    private readonly redisService: RedisService,
  ) {
    super(userEventRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['user', 'reminders', 'offerings'];
  }

  protected getSearchableFields(): string[] {
    return ['title', 'description', 'location'];
  }

  protected createQueryBuilder(
    filter: FilterUserEvent,
  ): SelectQueryBuilder<UserEvent> {
    const aliasName = UserEvent.name.toLowerCase();
    const queryBuilder = this.userEventRepository.createQueryBuilder(
      `${aliasName}`,
    );

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    // Apply filters if provided
    if (filter.userId) {
      queryBuilder.andWhere(`${aliasName}.userId = :userId`, {
        userId: filter.userId,
      });
    }

    if (filter.status) {
      queryBuilder.andWhere(`${aliasName}.status = :status`, {
        status: filter.status,
      });
    }

    if (filter.eventDate) {
      queryBuilder.andWhere(`${aliasName}.eventDate = :eventDate`, {
        eventDate: filter.eventDate,
      });
    }

    return queryBuilder;
  }
}
