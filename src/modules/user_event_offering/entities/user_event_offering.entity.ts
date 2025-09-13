import { AbstractEntity } from 'src/common/base/entity.base';
import { UserEvent } from 'src/modules/user-event/entities/user-event.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('user_event_offerings')
export class UserEventOffering extends AbstractEntity {
  @Column({ name: 'user_event_id' })
  userEventId: string;

  @Column({ name: 'offering_name' })
  offeringName: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => UserEvent, (userEvent) => userEvent.id)
  userEvent: UserEvent;
  constructor(partial: Partial<UserEventOffering>) {
    super();
    Object.assign(this, partial);
  }
}
