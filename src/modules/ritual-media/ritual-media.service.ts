import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { RitualMedia } from './entities/ritual-media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class RitualMediaService extends BaseService<RitualMedia> {
  constructor(
    @InjectRepository(RitualMedia, 'postgresql')
    private readonly ritualMediaRepository: Repository<RitualMedia>,
    private readonly redisService: RedisService,
  ) {
    super(ritualMediaRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['ritual'];
  }

  protected getSearchableFields(): string[] {
    return ['url', 'alt'];
  }
}
