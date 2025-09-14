import { AbstractEntity } from 'src/common/base/entity.base';
import { Ritual } from 'src/modules/ritual/entities/ritual.entity';
import { OfferingMedia } from 'src/modules/offering-media/entities/offering-media.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'offerings' })
export class Offering extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Ritual, (ritual) => ritual.offerings)
  ritual: Ritual;

  @OneToMany(() => OfferingMedia, (offeringMedia) => offeringMedia.offering, {
    cascade: true,
  })
  offeringMedias: OfferingMedia[];

  constructor(partial: Partial<Offering>) {
    super();
    Object.assign(this, partial);
  }
}
