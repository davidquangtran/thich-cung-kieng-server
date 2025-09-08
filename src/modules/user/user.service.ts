import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service.base';
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
}
