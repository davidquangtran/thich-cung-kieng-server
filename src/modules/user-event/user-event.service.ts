import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { UserEvent } from './entities/user-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

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
}
