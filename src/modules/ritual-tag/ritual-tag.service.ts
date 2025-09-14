import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { RitualTag } from './entities/ritual-tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class RitualTagService extends BaseService<RitualTag> {
  constructor(
    @InjectRepository(RitualTag, 'postgresql')
    private readonly ritualTagRepository: Repository<RitualTag>,
    private readonly redisService: RedisService,
  ) {
    super(ritualTagRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['ritualId', 'tagId'];
  }

  protected getDefaultRelations(): string[] {
    return ['ritual', 'tag'];
  }

  protected getSearchableFields(): string[] {
    return [];
  }
}
