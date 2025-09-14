import { Injectable } from '@nestjs/common';
import { CreateUserEventOfferingDto } from './dto/create-user_event_offering.dto';
import { UpdateUserEventOfferingDto } from './dto/update-user_event_offering.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEventOffering } from './entities/user_event_offering.entity';
import { Repository } from 'typeorm';
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
}
