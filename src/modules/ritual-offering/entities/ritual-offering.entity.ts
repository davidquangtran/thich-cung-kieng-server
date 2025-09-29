import { AbstractEntity } from 'src/common/base/entity.base';
import { Offering } from 'src/modules/offering/entities/offering.entity';
import { Ritual } from 'src/modules/ritual/entities/ritual.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'ritual_offerings' })
export class RitualOffering extends AbstractEntity {
  @Column({ name: 'ritual_id' })
  ritualId: string;

  @Column({ name: 'offering_id' })
  offeringId: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => Ritual, (ritual) => ritual.id)
  @JoinColumn({ name: 'ritual_id' })
  ritual: Ritual;

  @ManyToOne(() => Offering, (offering) => offering.id)
  @JoinColumn({ name: 'offering_id' })
  offering: Offering;

  constructor(partial: Partial<RitualOffering>) {
    super();
    Object.assign(this, partial);
  }
}
