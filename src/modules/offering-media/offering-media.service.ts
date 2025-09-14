import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { OfferingMedia } from './entities/offering-media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class OfferingMediaService extends BaseService<OfferingMedia> {
  constructor(
    @InjectRepository(OfferingMedia, 'postgresql')
    private readonly offeringMediaRepository: Repository<OfferingMedia>,
    private readonly redisService: RedisService,
  ) {
    super(offeringMediaRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['offering'];
  }

  protected getSearchableFields(): string[] {
    return ['url', 'alt'];
  }
}
