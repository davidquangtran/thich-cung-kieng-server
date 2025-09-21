import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Ritual } from './entities/ritual.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterRitualDto } from './dto/filter-ritual.dto';
import { CreateRitualDto } from './dto/create-ritual.dto';
import { RitualCategory } from '../ritual-category/entities/ritual-category.entity';
import { OfferingRitualService } from '../offering-ritual/offering-ritual.service';
import { RitualMediaService } from '../ritual-media/ritual-media.service';
import { RitualTagService } from '../ritual-tag/ritual-tag.service';

@Injectable()
export class RitualService extends BaseService<Ritual> {
  constructor(
    @InjectRepository(Ritual, 'postgresql')
    private readonly ritualRepository: Repository<Ritual>,
    private readonly redisService: RedisService,
    private readonly offeringRitualService: OfferingRitualService,
    private readonly ritualMediaService: RitualMediaService,
    private readonly ritualTagService: RitualTagService,
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

  protected createQueryBuilder(
    filter: FilterRitualDto,
  ): SelectQueryBuilder<Ritual> {
    const aliasName = Ritual.name.toLowerCase();
    const queryBuilder = this.ritualRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    if (filter.difficultyLevel) {
      queryBuilder.andWhere(`${aliasName}.difficultyLevel = :difficultyLevel`, {
        difficultyLevel: filter.difficultyLevel,
      });
    }
    if (filter.timeOfExecution) {
      queryBuilder.andWhere(`${aliasName}.timeOfExecution = :timeOfExecution`, {
        timeOfExecution: filter.timeOfExecution,
      });
    }
    if (filter.dateSolar) {
      queryBuilder.andWhere(`${aliasName}.dateSolar = :dateSolar`, {
        dateSolar: filter.dateSolar,
      });
    }
    if (filter.dateLunar) {
      queryBuilder.andWhere(`${aliasName}.dateLunar = :dateLunar`, {
        dateLunar: filter.dateLunar,
      });
    }
    if (filter.isHot !== undefined) {
      queryBuilder.andWhere(`${aliasName}.isHot = :isHot`, {
        isHot: filter.isHot,
      });
    }
    if (filter.ritualCategoryId) {
      queryBuilder.andWhere(
        `${aliasName}.ritualCategoryId = :ritualCategoryId`,
        {
          ritualCategoryId: filter.ritualCategoryId,
        },
      );
    }

    return queryBuilder;
  }

  protected async validateCreateInput(
    createDto: CreateRitualDto,
  ): Promise<void> {
    if (createDto.ritualCategoryId) {
      const isCategoryExist = await this.checkForeignKeyExist(
        RitualCategory.name,
        createDto.ritualCategoryId.toString(),
      );
      if (!isCategoryExist) {
        throw new BadRequestException('Invalid ritualCategoryId');
      }
    }
  }

  protected async createRelationships(
    manager: EntityManager,
    mainEntity: Ritual,
    relationData?: Record<string, any>,
  ): Promise<void> {
    const promises: Promise<any>[] = [];
    if (relationData?.ritualOfferings?.length) {
      relationData.ritualOfferings.forEach((offering) => {
        const ritualOffering = {
          ritualId: mainEntity.id,
          offeringId: offering.offeringId,
          quantity: offering.quantity || 1,
        };
        promises.push(this.offeringRitualService.create(ritualOffering));
      });
    }
    if (relationData?.ritualMedias?.length) {
      relationData.ritualMedias.forEach((media) => {
        const ritualMedia = {
          ritualId: mainEntity.id,
          type: media.type,
          url: media.url,
          alt: media.alt,
        };
        promises.push(this.ritualMediaService.create(ritualMedia));
      });
    }
    if (relationData?.ritualTags?.length) {
      relationData.ritualTags.forEach((tag) => {
        const ritualTag = {
          ritualId: mainEntity.id,
          tagId: tag.tagId,
        };
        promises.push(this.ritualTagService.create(ritualTag));
      });
    }
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }
}
