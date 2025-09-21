import { AbstractEntity } from 'src/common/base/entity.base';
import { OfferingMedia } from 'src/modules/offering-media/entities/offering-media.entity';
import { RitualOffering } from 'src/modules/ritual-offering/entities/ritual-offering.entity';
import { Column, Entity, OneToMany } from 'typeorm';

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
