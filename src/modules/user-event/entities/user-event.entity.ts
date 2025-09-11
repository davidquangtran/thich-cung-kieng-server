import { AbstractEntity } from 'src/common/base/entity.base';
import { Entity } from 'typeorm';

@Entity('user_events')
export class UserEvent extends AbstractEntity {
  constructor(partial: Partial<UserEvent>) {
    super();
    Object.assign(this, partial);
  }
}
