import { BuildCacheKeyOptions } from './../interfaces/build-cache-key-options.interface';
import { RedisService } from 'src/shared/redis/redis.service';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { buildCacheKey } from '../utils/build-cache-key.util';
import {
  CACHE_FIELD_DETAIL,
  CACHE_FIELD_FIND_OPTIONS,
  CACHE_FIELD_LIST_ALL_FILTER,
  CACHE_FIELD_SELECT_OPTIONS,
  CACHE_NAMESPACE,
  TTL_SECONDS,
} from '../constants/cache.constant';
import { BaseFilterDto } from './dto/base-filter.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractEntity } from './entity.base';

@Injectable()
export abstract class BaseService<T extends AbstractEntity> {
  private readonly logger: Logger;
  constructor(
    private readonly repository: Repository<T>,
    private readonly redis: RedisService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async findAll(
    filter: BaseFilterDto,
    relations: string[],
    select: string[],
  ): Promise<PaginatedResponseDto<T> | null> {
    try {
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const sortBy = filter.sortBy || 'createdAt';
      const sortOrder = filter.sortOrder || 'DESC';
      const search = filter.search;
      const skip = (page - 1) * limit;

      // Create query builder with base filters
      const entityName = this.getEntityName();
      const entityAlias = entityName.toLowerCase();
      const queryBuilder = this.createQueryBuilder(filter);

      // Add search condition
      if (search && this.getSearchableFields().length > 0) {
        const searchFields = this.getSearchableFields();

        // Dùng similarity để so sánh mờ (fuzzy match)
        const fuzzyConditions = searchFields
          .map(
            (field) =>
              `similarity(unaccent(${entityAlias}."${field}"), unaccent(:search)) > 0.2`,
          )
          .join(' OR ');

        // Ngoài ra, hỗ trợ ILIKE + %term% để bắt chuỗi gần chính xác
        const ilikeConditions = searchFields
          .map(
            (field) =>
              `unaccent(${entityAlias}."${field}") ILIKE unaccent(:ilikeSearch)`,
          )
          .join(' OR ');

        // Kết hợp cả hai
        queryBuilder.andWhere(`(${fuzzyConditions} OR ${ilikeConditions})`, {
          search,
          ilikeSearch: `%${search}%`,
        });
      }

      // Add valid relations
      if (relations && relations.length > 0) {
        this.autoJoinRelations(queryBuilder, entityAlias, relations);
      }

      // Add sorting and pagination
      queryBuilder
        .orderBy(`${entityAlias}.${sortBy}`, sortOrder as 'ASC' | 'DESC')
        .skip(skip)
        .take(limit);

      this.logger.log(
        `Finding all ${entityName} with query:`,
        queryBuilder.getQuery(),
      );

      // Add select
      if (select && select.length > 0) {
        const auditFields = [
          'createdAt',
          'updatedAt',
          'createdBy',
          'updatedBy',
          'deletedAt',
        ];
        const finalSelect = [...select];
        if (!finalSelect.includes('id')) {
          finalSelect.push('id');
        }
        auditFields.forEach((field) => {
          if (!finalSelect.includes(field)) {
            finalSelect.push(field);
          }
        });

        queryBuilder.select(
          finalSelect.map((field) => `${entityAlias}.${field}`),
        );
      }

      this.logger.log(
        `Finding all ${entityName} with query:`,
        queryBuilder.getQuery(),
      );

      const [data, totalItems] = await queryBuilder.getManyAndCount();
      const cacheKey = this.getCacheKey({
        identifier: JSON.stringify({ filter, relations, select }),
        field: CACHE_FIELD_LIST_ALL_FILTER,
      });
      const cached = await this.redis.get<PaginatedResponseDto<T>>(cacheKey);
      if (cached) return cached;

      const result = new PaginatedResponseDto<T>(data, totalItems, page, limit);

      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      this.logger.error(`Error finding all ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  async findByOption(options: FindOptionsWhere<T>): Promise<T | null> {
    try {
      const cacheKey = this.getCacheKey({
        identifier: JSON.stringify(options),
        field: CACHE_FIELD_FIND_OPTIONS,
      });
      const cached = await this.redis.get<T>(cacheKey);
      if (cached) return cached;

      const result = await this.repository.findOne({
        where: { ...options, deletedAt: null } as any as FindOptionsWhere<T>,
      });
      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      this.logger.error(
        `Error finding ${this.getEntityName()} by options:`,
        error,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const cacheKey = this.getCacheKey({
        identifier: id,
        field: CACHE_FIELD_DETAIL,
      });
      const cached = await this.redis.get<T>(cacheKey);
      if (cached) return cached;

      const result = await this.repository.findOne({
        where: { id, deletedAt: null } as any as FindOptionsWhere<T>,
      });
      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      this.logger.error(
        `Error finding one ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async selectOptions(): Promise<T[] | null> {
    try {
      const cacheKey = this.getCacheKey({ field: CACHE_FIELD_SELECT_OPTIONS });
      const cached = await this.redis.get<T[]>(cacheKey);
      if (cached) return cached;

      const result = await this.repository.find({
        where: { deletedAt: null } as any as FindOptionsWhere<T>,
        select: ['id', 'name'] as Array<keyof T>,
      });
      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      this.logger.error(
        `Error getting select options for ${this.getEntityName()}:`,
        error,
      );
      throw error;
    }
  }

  async create(data: DeepPartial<T>, relations: string[]): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(`Error creating ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return null;
      this.repository.merge(entity, data);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(
        `Error updating ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async updateField(id: string, field: keyof T, value: any): Promise<T | null> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return null;
      entity[field] = value;
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(
        `Error updating field ${String(field)} of ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return;
      await this.redis.del(
        this.getCacheKey({ identifier: id, field: CACHE_FIELD_DETAIL }),
      );
      await this.repository.remove(entity);
    } catch (error) {
      this.logger.error(
        `Error deleting ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return;
      await this.redis.del(
        this.getCacheKey({ identifier: id, field: CACHE_FIELD_DETAIL }),
      );
      await this.repository.softRemove(entity);
    } catch (error) {
      this.logger.error(
        `Error soft deleting ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  private getCacheKey(options: BuildCacheKeyOptions): string {
    return buildCacheKey({
      namespace: CACHE_NAMESPACE,
      module: this.getEntityName(),
      ...options,
    });
  }

  private getEntityName(): string {
    return this.repository.metadata.name;
  }

  private autoJoinRelations(
    queryBuilder: any,
    baseAlias: string,
    relations: string[],
  ) {
    const joined = new Set<string>();

    relations.forEach((relationPath) => {
      const parts = relationPath.split('.');
      let currentAlias = baseAlias;

      for (const part of parts) {
        const nextAlias = `${currentAlias}_${part}`;
        const fullPath = `${currentAlias}.${part}`;

        if (!joined.has(fullPath)) {
          queryBuilder.leftJoinAndSelect(fullPath, nextAlias);
          joined.add(fullPath);
        }

        currentAlias = nextAlias;
      }
    });
  }

  /**
   * Override this method in child classes to specify searchable fields
   * @returns The searchable fields
   */
  protected getSearchableFields(): string[] {
    return [];
  }

  /**
   * Override method fields to filter in findAll
   * @returns The fields to filter in findAll
   */
  protected createQueryBuilder(filter: any): SelectQueryBuilder<T> {
    const entityAlias = this.getEntityName().toLowerCase();
    const queryBuilder = this.repository.createQueryBuilder(entityAlias);
    return queryBuilder;
  }
}
