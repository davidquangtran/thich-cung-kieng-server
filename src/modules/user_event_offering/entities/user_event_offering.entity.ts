import { AbstractEntity } from 'src/common/base/entity.base';
import { Entity } from 'typeorm';

@Entity('user_event_offerings')
export class UserEventOffering extends AbstractEntity {
  constructor(partial: Partial<UserEventOffering>) {
    super();
    Object.assign(this, partial);
  }
}
