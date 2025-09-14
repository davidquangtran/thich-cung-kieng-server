import { RedisService } from 'src/shared/redis/redis.service';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { CACHE_FIELD_DETAIL } from '../../constants/cache.constant';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractEntity } from '../entity.base';
import { QueryServiceBase } from './query-service.base';

@Injectable()
export abstract class BaseService<
  T extends AbstractEntity,
> extends QueryServiceBase<T> {
  constructor(repository: Repository<T>, redis: RedisService) {
    super(repository, redis);
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    try {
      if (!createDto) throw new Error('Data to create is required');
      const duplicateFields = this.getDuplicateFields();
      await this.checkDuplicateField(duplicateFields, createDto);
      await this.validateCreateInput(createDto);
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(`Error creating ${this.getEntityName()}:`, error);
      throw error;
    }
  }

  async createWithRelations(
    createDto: DeepPartial<T>,
    relationData?: Record<string, any>,
  ): Promise<T | null> {
    return await this.repository.manager.transaction(
      async (manager: EntityManager) => {
        try {
          if (!createDto) throw new Error('Data to create is required');
          const duplicateFields = this.getDuplicateFields();
          await this.checkDuplicateField(duplicateFields, createDto);
          const entity = this.repository.create(createDto);
          const savedEntity = await manager.save(entity);
          if (relationData && Object.keys(relationData).length > 0) {
            await this.createRelationships(manager, savedEntity, relationData);
          }
          this.logger.log(
            `Created ${this.getEntityName()} with relations, id: ${savedEntity.id}`,
          );
          return savedEntity;
        } catch (error) {
          this.logger.error(
            `Error creating ${this.getEntityName()} with relations:`,
            error,
          );
          throw error;
        }
      },
    );
  }

  async update(id: string, updateDto: DeepPartial<T>): Promise<T | null> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return null;
      const duplicateFields = this.getDuplicateFields();
      await this.checkDuplicateField(duplicateFields, updateDto);
      this.repository.merge(entity, updateDto);
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
      if (!id || !field) {
        throw new BadRequestException('ID and field to update are required');
      }
      const entity = await this.findOne(id);
      if (!entity) return null;
      (entity as any)[field] = value;
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(
        `Error updating field ${String(field)} of ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async updateWithRelations(
    id: string,
    updateDto: DeepPartial<T>,
    relationData?: Record<string, any>,
  ): Promise<T | null> {
    return await this.repository.manager.transaction(
      async (manager: EntityManager) => {
        try {
          if (!id || !updateDto) {
            throw new BadRequestException('ID and update data are required');
          }
          const entity = await this.findOne(id);
          if (!entity) return null;

          const duplicateFields = this.getDuplicateFields();
          await this.checkDuplicateField(duplicateFields, updateDto);
          this.repository.merge(entity, updateDto);
          const updatedEntity = await this.repository.save(entity);

          if (relationData && Object.keys(relationData).length > 0) {
            await this.updateRelationships(
              manager,
              updatedEntity,
              relationData,
            );
          }

          this.logger.log(
            `Updated ${this.getEntityName()} with relations, id: ${updatedEntity.id}`,
          );
          return updatedEntity;
        } catch (error) {
          this.logger.error(
            `Error updating ${this.getEntityName()} with id ${id} and relations:`,
            error,
          );
          throw error;
        }
      },
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!id) throw new Error('ID to delete is required');
      const entity = await this.findOne(id);
      if (!entity) return false;
      await this.redis.del(
        this.getCacheKey({ identifier: id, field: CACHE_FIELD_DETAIL }),
      );
      await this.repository.delete(id);
      return true;
    } catch (error) {
      this.logger.error(
        `Error deleting ${this.getEntityName()} with id ${id}:`,
        error,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      if (!id) throw new Error('ID to remove is required');
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

  async softRemove(id: string): Promise<void> {
    try {
      if (!id) throw new Error('ID to soft remove is required');
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

  // Utility method
  private async checkDuplicateField(
    fields: string[],
    data: DeepPartial<T>,
  ): Promise<void> {
    for (const field of fields) {
      const value = data[field];
      if (!value) continue;

      const isExisting = await this.findByOptions({
        [field]: value,
      } as any);
      if (isExisting) {
        throw new BadRequestException(
          `${this.getEntityName()} with ${field} ${value} already exists`,
        );
      }
    }
  }

  // OPTIONAL METHOD - Override in child classes if needed
  /**
   * Create relationships after creating the main entity.
   * @param manager The EntityManager to use for database operations.
   * @param mainEntity The main entity that was created.
   * @param relationData Additional data needed to create relationships.
   */
  protected async createRelationships(
    manager: EntityManager,
    mainEntity: T,
    relationData?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(
      `No relationship creation implemented for ${this.getEntityName()}`,
    );
  }

  /**
   * Update relationships after updating the main entity.
   * @param manager EntityManager
   * @param mainEntity The main entity that was updated.
   * @param relationData Additional data needed to update relationships.
   */
  protected async updateRelationships(
    manager: EntityManager,
    mainEntity: T,
    relationData?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(
      `No relationship update implemented for ${this.getEntityName()}`,
    );
  }

  /**
   * Validate the input data for creating a new entity.
   * @param createDto The data to validate.
   */
  protected async validateCreateInput(
    createDto: DeepPartial<T>,
  ): Promise<void> {
    // Override in child classes for custom validation
    // Default: no validation
  }

  /**
   * Validate the update data before updating an existing entity.
   * @param updateDto The data to validate.
   */
  protected async validateUpdateInput(
    updateDto: DeepPartial<T>,
  ): Promise<void> {
    // Override in child classes for custom validation
    // Default: no validation
  }

  /**
   * Validate the relation data before creating relationships.
   * @param relationData The relation data to validate.
   */
  protected async validateRelationData(
    relationData: Record<string, any>,
  ): Promise<void> {
    // Override in child classes for custom validation
    // Default: no validation
  }
}
