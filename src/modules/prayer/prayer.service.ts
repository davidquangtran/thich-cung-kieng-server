import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Prayer } from './entities/prayer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class PrayerService extends BaseService<Prayer> {
  constructor(
    @InjectRepository(Prayer, 'postgresql')
    private readonly prayerRepository: Repository<Prayer>,
    private readonly redisService: RedisService,
  ) {
    super(prayerRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return ['ritual'];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'content', 'description'];
  }
}
