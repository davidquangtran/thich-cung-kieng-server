import { AbstractEntity } from 'src/common/base/entity.base';
import { Ritual } from 'src/modules/ritual/entities/ritual.entity';
import { OfferingMedia } from 'src/modules/offering-media/entities/offering-media.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { RitualOffering } from 'src/modules/offering-ritual/entities/ritual-offering.entity';

@Entity({ name: 'offerings' })
export class Offering extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => OfferingMedia, (offeringMedia) => offeringMedia.offering, {
    cascade: true,
  })
  offeringMedias: OfferingMedia[];

  @OneToMany(
    () => RitualOffering,
    (ritualOffering) => ritualOffering.offering,
    {
      cascade: true,
    },
  )
  offeringRituals: RitualOffering[];

  constructor(partial: Partial<Offering>) {
    super();
    Object.assign(this, partial);
  }
}
