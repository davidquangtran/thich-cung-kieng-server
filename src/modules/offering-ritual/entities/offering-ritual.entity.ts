import { AbstractEntity } from 'src/common/base/entity.base';
import { Offering } from 'src/modules/offering/entities/offering.entity';
import { Ritual } from 'src/modules/ritual/entities/ritual.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'offering_rituals' })
export class OfferingRitual extends AbstractEntity {
  @Column({ name: 'ritual_id' })
  ritualId: string;

  @Column({ name: 'offering_id' })
  offeringId: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Ritual, (ritual) => ritual.id)
  ritual: Ritual;

  @ManyToOne(() => Offering, (offering) => offering.id)
  offering: Offering;

  constructor(partial: Partial<OfferingRitual>) {
    super();
    Object.assign(this, partial);
  }
}
