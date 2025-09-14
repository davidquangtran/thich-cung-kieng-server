import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Ritual } from './entities/ritual.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class RitualService extends BaseService<Ritual> {
  constructor(
    @InjectRepository(Ritual, 'postgresql')
    private readonly ritualRepository: Repository<Ritual>,
    private readonly redisService: RedisService,
  ) {
    super(ritualRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return ['ritualOfferings', 'ritualOfferings.offering'];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description'];
  }
}
