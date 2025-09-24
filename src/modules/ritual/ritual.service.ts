import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { Ritual } from './entities/ritual.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterRitualDto } from './dto/filter-ritual.dto';
import { CreateRitualDto } from './dto/create-ritual.dto';
import { RitualCategory } from '../ritual-category/entities/ritual-category.entity';
import { RitualMediaService } from '../ritual-media/ritual-media.service';
import { RitualTagService } from '../ritual-tag/ritual-tag.service';
import { RitualOfferingService } from '../ritual-offering/ritual-offering.service';
import { PrayerService } from '../prayer/prayer.service';
import { RitualOffering } from '../ritual-offering/entities/ritual-offering.entity';

@Injectable()
export class RitualService extends BaseService<Ritual> {
  constructor(
    @InjectRepository(Ritual, 'postgresql')
    private readonly ritualRepository: Repository<Ritual>,
    private readonly redisService: RedisService,
    private readonly ritualOfferingService: RitualOfferingService,
    private readonly ritualMediaService: RitualMediaService,
    private readonly ritualTagService: RitualTagService,
    private readonly ritualPrayerService: PrayerService,
  ) {
    super(ritualRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return [
      'ritualMedias',
      'ritualTags',
      'offerings',
      'prayers',
      'ritualReviews',
      'favoriteByUsers',
    ];
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
    if (!createDto) throw new BadRequestException('Data to create is required');
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
        promises.push(this.ritualOfferingService.create(ritualOffering));
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
    if (relationData?.ritualPrayers?.length) {
      relationData.ritualPrayers.forEach((prayer) => {
        const ritualPrayer = {
          ritualId: mainEntity.id,
          prayerId: prayer.id,
          name: prayer.name,
          content: prayer.content,
          note: prayer.note,
          description: prayer.description,
        };
        promises.push(this.ritualPrayerService.create(ritualPrayer));
      });
    }
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  /**
   * Smart update for individual relation properties
   * Only updates specific fields instead of recreating entire relations
   */
  async updateRelationProperty(
    relationId: string,
    relationType: 'offering' | 'media' | 'tag' | 'prayer',
    field: string,
    value: any,
  ): Promise<boolean> {
    try {
      switch (relationType) {
        case 'offering':
          return (
            (await this.ritualOfferingService.updateField(
              relationId,
              field as any,
              value,
            )) !== null
          );

        case 'media':
          return (
            (await this.ritualMediaService.updateField(
              relationId,
              field as any,
              value,
            )) !== null
          );

        case 'tag':
          return (
            (await this.ritualTagService.updateField(
              relationId,
              field as any,
              value,
            )) !== null
          );

        case 'prayer':
          return (
            (await this.ritualPrayerService.updateField(
              relationId,
              field as any,
              value,
            )) !== null
          );

        default:
          throw new BadRequestException(
            `Unsupported relation type: ${relationType}`,
          );
      }
    } catch (error) {
      this.logger.error(
        `Error updating ${relationType} field ${field} with id ${relationId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Batch update multiple relation properties efficiently
   * Example: Update quantities for multiple offerings at once
   */
  async batchUpdateRelationProperties(
    updates: Array<{
      relationId: string;
      relationType: 'offering' | 'media' | 'tag' | 'prayer';
      updates: Record<string, any>;
    }>,
  ): Promise<boolean[]> {
    const promises = updates.map(
      ({ relationId, relationType, updates: updateData }) => {
        switch (relationType) {
          case 'offering':
            return this.ritualOfferingService.update(relationId, updateData);
          case 'media':
            return this.ritualMediaService.update(relationId, updateData);
          case 'tag':
            return this.ritualTagService.update(relationId, updateData);
          case 'prayer':
            return this.ritualPrayerService.update(relationId, updateData);
          default:
            throw new BadRequestException(
              `Unsupported relation type: ${relationType}`,
            );
        }
      },
    );

    const results = await Promise.all(promises);
    return results.map((result) => result !== null);
  }

  /**
   * Optimized updateRelationships with minimal changes approach
   * Only processes actual changes instead of full recreation
   */
  protected async updateRelationships(
    manager: EntityManager,
    mainEntity: Ritual,
    relationData?: Record<string, any>,
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    // Smart offering updates - only change what's different
    if (relationData?.ritualOfferings) {
      const existingOfferings = await this.ritualOfferingService.findAllByOptions({
        ritualId: mainEntity.id,
      });
      const inputOfferings = relationData.ritualOfferings;

      // Create maps for easy lookup
      const existingMap = new Map(
        (existingOfferings ?? []).map((o) => [o.offeringId, o]),
      );
      const inputMap = new Map(inputOfferings.map((o) => [o.offeringId, o]));

      // Find what to add, update, and remove
      const toAdd = inputOfferings.filter(
        (input) => !existingMap.has(input.offeringId),
      );
      const toRemove = (existingOfferings ?? []).filter(
        (existing) => !inputMap.has(existing.offeringId),
      );
      const toUpdate = inputOfferings.filter((input) => {
        const existing = existingMap.get(input.offeringId);
        return existing && existing.quantity !== input.quantity;
      });

      // Execute changes
      for (const offering of toAdd) {
        promises.push(
          this.ritualOfferingService.create({
            ritualId: mainEntity.id,
            offeringId: offering.offeringId,
            quantity: offering.quantity || 1,
          }),
        );
      }

      for (const offering of toRemove) {
        promises.push(this.ritualOfferingService.remove(offering.id));
      }

      for (const offering of toUpdate) {
        const existing = existingMap.get(offering.offeringId);
        if (existing?.id) {
          promises.push(
            this.ritualOfferingService.updateField(
              existing.id,
              'quantity',
              offering.quantity,
            ),
          );
        }
      }
    }
    if (relationData?.ritualMedias) {
      const existingMedias = await this.ritualMediaService.findAllByOptions({
        ritualId: mainEntity.id,
      });
      const inputMedias = relationData.ritualMedias;

      const existingMap = new Map((existingMedias ?? []).map((m) => [m.url, m]));
      const inputMap = new Map(inputMedias.map((m) => [m.url, m]));

      const toAdd = inputMedias.filter((input) => !existingMap.has(input.url));
      const toRemove = (existingMedias ?? []).filter(
        (existing) => !inputMap.has(existing.url),
      );
      const toUpdate = inputMedias.filter((input) => {
        const existing = existingMap.get(input.url);
        return (
          existing &&
          (existing.type !== input.type || existing.alt !== input.alt)
        );
      });

      for (const media of toAdd) {
        promises.push(
          this.ritualMediaService.create({
            ritualId: mainEntity.id,
            type: media.type,
            url: media.url,
            alt: media.alt,
          }),
        );
      }
      for (const media of toRemove) {
        promises.push(this.ritualMediaService.remove(media.id));
      }
      for (const media of toUpdate) {
        const existing = existingMap.get(media.url);
        if (existing?.id) {
          promises.push(
            this.ritualMediaService.update(existing.id, {
              type: media.type,
              alt: media.alt,
            }),
          );
        }
      }
    }

    // Optimized ritualTags update
    if (relationData?.ritualTags) {
      const existingTags = await this.ritualTagService.findAllByOptions({
        ritualId: mainEntity.id,
      });
      const inputTags = relationData.ritualTags;

      const existingMap = new Map((existingTags ?? []).map((t) => [t.tagId, t]));
      const inputMap = new Map(inputTags.map((t) => [t.tagId, t]));

      const toAdd = inputTags.filter((input) => !existingMap.has(input.tagId));
      const toRemove = (existingTags ?? []).filter(
        (existing) => !inputMap.has(existing.tagId),
      );
      // No update for tags since only tagId is stored

      for (const tag of toAdd) {
        promises.push(
          this.ritualTagService.create({
            ritualId: mainEntity.id,
            tagId: tag.tagId,
          }),
        );
      }
      for (const tag of toRemove) {
        promises.push(this.ritualTagService.remove(tag.id));
      }
    }

    // Optimized ritualPrayers update
    if (relationData?.ritualPrayers) {
      const existingPrayers = await this.ritualPrayerService.findAllByOptions({
        ritualId: mainEntity.id,
      });
      const inputPrayers = relationData.ritualPrayers;

      const existingMap = new Map(
        (existingPrayers ?? []).map((p) => [p.name, p]),
      );
      const inputMap = new Map(
        inputPrayers.map((p) => [p.name, p]),
      );

      const toAdd = inputPrayers.filter(
        (input) => !existingMap.has(input.name),
      );
      const toRemove = (existingPrayers ?? []).filter(
        (existing) => !inputMap.has(existing.name),
      );
      const toUpdate = inputPrayers.filter((input) => {
        const existing = existingMap.get(input.name);
        return (
          existing &&
          (existing.note !== input.note ||
            existing.description !== input.description)
        );
      });

      for (const prayer of toAdd) {
        promises.push(
          this.ritualPrayerService.create({
            ritualId: mainEntity.id,
            name: prayer.name,
            content: prayer.content,
            note: prayer.note,
            description: prayer.description,
          }),
        );
      }
      for (const prayer of toRemove) {
        promises.push(this.ritualPrayerService.remove(prayer.id));
      }
      for (const prayer of toUpdate) {
        const existing = existingMap.get(prayer.name);
        if (existing?.id) {
          promises.push(
            this.ritualPrayerService.update(existing.id, {
              note: prayer.note,
              description: prayer.description,
            }),
          );
        }
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
      this.logger.log(
        `Optimized update completed: ${promises.length} operations`,
      );
    }
  }
}
