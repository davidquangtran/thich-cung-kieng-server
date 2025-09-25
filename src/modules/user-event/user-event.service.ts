import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base/service/service.base';
import { UserEvent } from './entities/user-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { FilterUserEvent } from './dto/filter-user-event.dto';
import { CreateUserEventDto } from './dto/create-user-event.dto';
import { UserEventReminderService } from '../user_event_reminder/user_event_reminder.service';
import { UserEventOfferingService } from '../user_event_offering/user_event_offering.service';

@Injectable()
export class UserEventService extends BaseService<UserEvent> {
  constructor(
    @InjectRepository(UserEvent, 'postgresql')
    private readonly userEventRepository: Repository<UserEvent>,
    private readonly redisService: RedisService,
    private readonly userEventReminderService: UserEventReminderService,
    private readonly userEventOfferingService: UserEventOfferingService,
  ) {
    super(userEventRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return [];
  }

  protected getDefaultRelations(): string[] {
    return ['user', 'reminders', 'offerings'];
  }

  protected getSearchableFields(): string[] {
    return ['title', 'description', 'location'];
  }

  protected createQueryBuilder(
    filter: FilterUserEvent,
  ): SelectQueryBuilder<UserEvent> {
    const aliasName = UserEvent.name.toLowerCase();
    const queryBuilder = this.userEventRepository.createQueryBuilder(
      `${aliasName}`,
    );

    // Apply soft delete filter by default
    queryBuilder.andWhere(`${aliasName}.deletedAt IS NULL`);

    // Apply filters if provided
    if (filter.userId) {
      queryBuilder.andWhere(`${aliasName}.userId = :userId`, {
        userId: filter.userId,
      });
    }

    if (filter.status) {
      queryBuilder.andWhere(`${aliasName}.status = :status`, {
        status: filter.status,
      });
    }

    if (filter.eventDate) {
      queryBuilder.andWhere(`${aliasName}.eventDate = :eventDate`, {
        eventDate: filter.eventDate,
      });
    }

    return queryBuilder;
  }

  protected async validateCreateInput(
    createDto: CreateUserEventDto,
  ): Promise<void> {
    if (!createDto) {
      throw new BadRequestException(
        'CreateUserEventDto cannot be null or undefined',
      );
    }
  }

  protected async createRelationships(
    manager: EntityManager,
    mainEntity: UserEvent,
    relationData?: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`Creating relationships for UserEvent: ${mainEntity.id}`);
    this.logger.log(`Relation data:`, relationData);

    const promises: Promise<any>[] = [];

    // Create event reminders
    if (relationData?.eventReminders?.length) {
      this.logger.log(
        `Creating ${relationData.eventReminders.length} event reminders`,
      );

      for (const reminder of relationData.eventReminders) {
        const userEventReminder = {
          userEventId: mainEntity.id,
          remindBefore: reminder.remindBefore,
          notifyMethod: reminder.notifyMethod,
          status: reminder.status,
        };

        this.logger.log(`Creating reminder:`, userEventReminder);
        promises.push(this.userEventReminderService.create(userEventReminder));
      }
    }

    // Create event offerings
    if (relationData?.eventOfferings?.length) {
      this.logger.log(
        `Creating ${relationData.eventOfferings.length} event offerings`,
      );

      for (const offering of relationData.eventOfferings) {
        const userEventOffering = {
          userEventId: mainEntity.id,
          offeringName: offering.offeringName,
          quantity: offering.quantity,
          note: offering.note,
        };

        this.logger.log(`Creating offering:`, userEventOffering);
        promises.push(this.userEventOfferingService.create(userEventOffering));
      }
    }

    if (promises.length > 0) {
      const results = await Promise.all(promises);
      this.logger.log(
        `Successfully created ${results.length} relationship records`,
      );
    } else {
      this.logger.log('No relationships to create');
    }
  }

  protected async updateRelationships(
    manager: EntityManager,
    mainEntity: UserEvent,
    relationData?: Record<string, any>,
  ): Promise<void> {
    const promises: Promise<any>[] = [];
    if (relationData?.reminders) {
      const existingReminders =
        await this.userEventReminderService.findAllByOptions({
          userEventId: mainEntity.id,
        });
      const inputReminder = relationData.reminders;

      // Create maps for easy lookup
      const existingMap = new Map(
        (existingReminders ?? []).map((o) => [o.id, o]),
      );
      const inputMap = new Map(inputReminder.map((r) => [r.id, r]));

      // Find what to add, update, and remove
      const toAdd = inputReminder.filter(
        (input) => input.id && !existingMap.has(input.id),
      );
      const toRemove = inputReminder.filter(
        (existing) => !inputMap.has(existing.id),
      );
      const toUpdate = inputReminder.filter((existing) => {
        const input = existingMap.get(existing.id);
        return (
          input &&
          (input.remindBefore !== existing.remindBefore ||
            input.notifyMethod !== existing.notifyMethod ||
            input.status !== existing.status)
        );
      });

      // Execute changes
      for (const reminder of toAdd) {
        promises.push(
          this.userEventReminderService.create({
            userEventId: mainEntity.id,
            remindBefore: reminder.remindBefore,
            notifyMethod: reminder.notifyMethod,
            status: reminder.status,
          }),
        );
      }

      for (const reminder of toRemove) {
        promises.push(this.userEventReminderService.remove(reminder.id));
      }

      for (const reminder of toUpdate) {
        const existing = existingMap.get(reminder.id);
        if (existing?.id) {
          promises.push(
            this.userEventReminderService.update(existing.id, {
              remindBefore: reminder.remindBefore,
              notifyMethod: reminder.notifyMethod,
              status: reminder.status,
            }),
          );
        }
      }
    }

    if (relationData?.eventOfferings) {
      const existingOfferings =
        await this.userEventOfferingService.findAllByOptions({
          userEventId: mainEntity.id,
        });
      const inputOfferings = relationData.eventOfferings;
      // Create maps for easy lookup
      const existingMap = new Map(
        (existingOfferings ?? []).map((o) => [o.id, o]),
      );
      const inputMap = new Map(inputOfferings.map((r) => [r.id, r]));
      // Find what to add, update, and remove
      const toAdd = inputOfferings.filter(
        (input) => input.id && !existingMap.has(input.id),
      );
      const toRemove = inputOfferings.filter(
        (existing) => !inputMap.has(existing.id),
      );
      const toUpdate = inputOfferings.filter((existing) => {
        const input = existingMap.get(existing.id);
        return (
          input &&
          (input.offeringName !== existing.offeringName ||
            input.quantity !== existing.quantity ||
            input.note !== existing.note)
        );
      });
      // Execute changes
      for (const offering of toAdd) {
        promises.push(
          this.userEventOfferingService.create({
            userEventId: mainEntity.id,
            offeringName: offering.offeringName,
            quantity: offering.quantity,
            note: offering.note,
          }),
        );
      }
      for (const offering of toRemove) {
        promises.push(this.userEventOfferingService.remove(offering.id));
      }
      for (const offering of toUpdate) {
        const existing = existingMap.get(offering.id);
        if (existing?.id) {
          promises.push(
            this.userEventOfferingService.update(existing.id, {
              offeringName: offering.offeringName,
              quantity: offering.quantity,
              note: offering.note,
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
