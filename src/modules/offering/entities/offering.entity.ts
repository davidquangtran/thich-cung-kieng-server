import { AbstractEntity } from 'src/common/base/entity.base';
import { Ritual } from 'src/modules/ritual/entities/ritual.entity';
import { OfferingMedia } from 'src/modules/offering-media/entities/offering-media.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OfferingRitual } from 'src/modules/offering-ritual/entities/offering-ritual.entity';

@Entity({ name: 'offerings' })
export class Offering extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Ritual, (ritual) => ritual.offerings)
  ritual: Ritual;

  @OneToMany(() => OfferingMedia, (offeringMedia) => offeringMedia.offering, {
    cascade: true,
  })
  offeringMedias: OfferingMedia[];

  @OneToMany(
    () => OfferingRitual,
    (offeringRitual) => offeringRitual.offering,
    {
      cascade: true,
    },
  )
  offeringRituals: OfferingRitual[];

  constructor(partial: Partial<Offering>) {
    super();
    Object.assign(this, partial);
  }
}
