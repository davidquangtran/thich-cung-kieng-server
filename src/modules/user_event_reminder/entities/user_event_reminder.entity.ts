import { AbstractEntity } from 'src/common/base/entity.base';
import { Entity } from 'typeorm';

@Entity('user_event_reminders')
export class UserEventReminder extends AbstractEntity {
  constructor(partial: Partial<UserEventReminder>) {
    super();
    Object.assign(this, partial);
  }
}
