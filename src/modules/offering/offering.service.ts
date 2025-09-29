import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { Offering } from './entities/offering.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base/service/service.base';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterOfferingDto } from './dto/filter-offering.dto';
import { OfferingMediaService } from '../offering-media/offering-media.service';
import { OfferingMedia } from '../offering-media/entities/offering-media.entity';

@Injectable()
export class OfferingService extends BaseService<Offering> {
  constructor(
    @InjectRepository(Offering, 'postgresql')
    private readonly offeringRepository: Repository<Offering>,
    private readonly redisService: RedisService,
    private readonly offeringMediaService: OfferingMediaService,
  ) {
    super(offeringRepository, redisService);
  }
  protected getDuplicateFields(): string[] {
    return ['name'];
  }

  protected getDefaultRelations(): string[] {
    return ['offeringMedias'];
  }

  protected getSearchableFields(): string[] {
    return ['name', 'description'];
  }

  protected createQueryBuilder(
    filter: FilterOfferingDto,
  ): SelectQueryBuilder<Offering> {
    const aliasName = Offering.name.toLowerCase();
    const queryBuilder = this.offeringRepository.createQueryBuilder(aliasName);

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    return queryBuilder;
  }

  protected async validateCreateInput(
    createDto: CreateOfferingDto,
  ): Promise<void> {
    if (!createDto) throw new BadRequestException('Data to create is required');
  }

  protected async createRelationships(
    manager: EntityManager,
    mainEntity: Offering,
    relationData?: Record<string, any>,
  ): Promise<void> {
    const promises: Promise<any>[] = [];
    if (relationData?.offeringMedias?.length) {
      relationData.offeringMedias.forEach((media) => {
        const offeringMedia = {
          ...media,
          offeringId: mainEntity.id,
        };
        promises.push(this.offeringMediaService.create(offeringMedia));
      });
    }
    await Promise.all(promises);
  }

  protected async updateRelationships(
    manager: EntityManager,
    mainEntity: Offering,
    relationData?: Record<string, any>,
  ): Promise<void> {
    const promises: Promise<any>[] = [];

    // Smart offering updates - only change what's different
    if (relationData?.offeringMedias) {
      const existingMedias = await this.offeringMediaService.findAllByOptions({
        offeringId: mainEntity.id,
      });
      const inputMedias = relationData.offeringMedias;

      // Create maps for easy lookup
      const existingMap = new Map((existingMedias ?? []).map((o) => [o.id, o]));
      const inputMap = new Map(inputMedias.map((o) => [o.id, o]));

      // Find what to add, update, and remove
      const toAdd = inputMedias.filter((input) => !existingMap.has(input.id));
      const toRemove = (existingMedias ?? []).filter(
        (existing) => !inputMap.has(existing.id),
      );
      const toUpdate = inputMedias.filter((input) => {
        const existing = existingMap.get(input.id);
        return (
          existing &&
          (existing.type !== input.type || existing.alt !== input.alt)
        );
      });

      // Execute changes
      for (const media of toAdd) {
        promises.push(
          this.offeringMediaService.create({
            offeringId: mainEntity.id,
            url: media.url,
            type: media.type,
            alt: media.alt,
          }),
        );
      }

      for (const media of toRemove) {
        promises.push(this.offeringMediaService.remove(media.id));
      }

      for (const media of toUpdate) {
        const existing = existingMap.get(media.url);
        if (existing?.id) {
          promises.push(
            this.offeringMediaService.update(existing.id, {
              type: media.type,
              alt: media.alt,
            }),
          );
        }
      }
      await Promise.all(promises);
    }
  }
}
