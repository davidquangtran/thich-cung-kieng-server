import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User, 'postgresql')
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {
    super(userRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['email'];
  }

  protected getDefaultRelations(): string[] {
    return ['userSubscriptions', 'chatSession'];
  }

  protected getSearchableFields(): string[] {
    return ['email', 'fullName', 'phone'];
  }
}
