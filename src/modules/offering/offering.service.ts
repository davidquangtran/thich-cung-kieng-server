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
    return ['ritualOfferings', 'ritualOfferings.ritual'];
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
}
