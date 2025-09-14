import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag, 'postgresql')
    private readonly tagRepository: Repository<Tag>,
    private readonly redisService: RedisService,
  ) {
    super(tagRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return [];
  }

  protected getSearchableFields(): string[] {
    return ['name'];
  }

  protected createQueryBuilder(filter: any): SelectQueryBuilder<Tag> {
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');

    // Apply soft delete filter by default
    queryBuilder.andWhere('tag.deletedAt IS NULL');

    // Apply filters if provided
    if (filter.name) {
      queryBuilder.andWhere('tag.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    return queryBuilder;
  }
}
