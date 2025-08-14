import { BuildCacheKeyOptions } from './../interfaces/build-cache-key-options.interface';
import { RedisService } from 'src/shared/redis/redis.service';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { buildCacheKey } from '../utils/build-cache-key.util';
import {
  CACHE_FIELD_DETAIL,
  CACHE_FIELD_LIST_ALL,
  CACHE_FIELD_LIST_ALL_OPTIONS,
  CACHE_FIELD_LIST_ALL_PAGINATION,
  CACHE_FIELD_LIST_ALL_SELECT,
  CACHE_NAMESPACE,
  TTL_SECONDS,
} from '../constants/cache.constant';
import { BaseFilterDto } from './dto/base-filter.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

export class ServiceBase<T extends ObjectLiteral> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly redis: RedisService,
  ) {}
  async findAll(): Promise<T[]> {
    try {
      const cacheKey = this.getCacheKey({ field: CACHE_FIELD_LIST_ALL });
      const cached = await this.redis.get<T[]>(cacheKey);
      if (cached) return cached;
      const result = await this.repository.find({
        where: { deletedAt: null },
      } as any as FindOptionsWhere<T>);
      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAllWithPagination(
    filter: BaseFilterDto,
    relations: string[],
    select: string[],
  ): Promise<PaginatedResponseDto<T>> {
    try {
      const cacheKey = this.getCacheKey({
        field: CACHE_FIELD_LIST_ALL_PAGINATION,
        identifier: JSON.stringify(filter),
      });
      const cached = await this.redis.get<PaginatedResponseDto<T>>(cacheKey);
      if (cached) return cached;

      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const sortBy = filter.sortBy || 'createdAt';
      const sortOrder = filter.sortOrder || 'DESC';
      const search = filter.search;
      const skip = (page - 1) * limit;

      const [data, totalItems] = await this.repository.findAndCount({
        where: { deletedAt: null } as any as FindOptionsWhere<T>,
        take: filter.limit,
        skip,
      });

      const result = new PaginatedResponseDto<T>(data, totalItems, page, limit);
      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
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
      throw error;
    }
  }

  async findByOptions(options: FindOptionsWhere<T>): Promise<T[] | null> {
    try {
      const cacheKey = this.getCacheKey({
        field: CACHE_FIELD_LIST_ALL_OPTIONS,
        identifier: JSON.stringify(options),
      });
      const cached = await this.redis.get<T[]>(cacheKey);
      if (cached) return cached;

      const result = await this.repository.find(options);
      await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async selectOptions(): Promise<T[] | null> {
    try {
      const cacheKey = this.getCacheKey({ field: CACHE_FIELD_LIST_ALL_SELECT });
      const cached = await this.redis.get<T[]>(cacheKey);
      if (cached) return cached;

      const result = await this.repository.find({
        where: { deletedAt: null } as any as FindOptionsWhere<T>,
        select: ['id', 'name'],
      });
      if (result) await this.redis.set(cacheKey, result, TTL_SECONDS);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async create(data: DeepPartial<T>, relations: string[]): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
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
}
