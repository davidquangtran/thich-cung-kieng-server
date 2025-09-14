import { Injectable } from '@nestjs/common';
import { CreateUserEventReminderDto } from './dto/create-user_event_reminder.dto';
import { UpdateUserEventReminderDto } from './dto/update-user_event_reminder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEventReminder } from './entities/user_event_reminder.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { BaseService } from 'src/common/base/service/service.base';

@Injectable()
export class UserEventReminderService extends BaseService<UserEventReminder> {
  constructor(
    @InjectRepository(UserEventReminder, 'postgresql')
    private readonly userEventReminderRepository: Repository<UserEventReminder>,
    private readonly redisService: RedisService,
  ) {
    super(userEventReminderRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['userEventId', 'remindBefore', 'notifyMethod'];
  }

  protected getDefaultRelations(): string[] {
    return ['userEvent'];
  }

  protected getSearchableFields(): string[] {
    return ['status', 'notifyMethod'];
  }
}
