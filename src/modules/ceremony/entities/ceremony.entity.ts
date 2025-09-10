import { AbstractEntity } from "src/common/base/entity.base";
import { CeremonyType } from "src/common/enums/ceremony-type.enum";
import { CeremonyMedia } from "src/modules/ceremony-media/entities/ceremony-media.entity";
import { CeremonyTag } from "src/modules/ceremony-tag/entities/ceremony-tag.entity";
import { Offering } from "src/modules/offering/entities/offering.entity";
import { Prayer } from "src/modules/prayer/entities/prayer.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ceremonies' })
export class Ceremony extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ name: 'date_lunar', type: 'varchar' })
    dateLunar: string;

    @Column({ name: 'date_solar', type: 'date' })
    dateSolar: string;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: CeremonyType, default: CeremonyType.BAPTISM })
    type: CeremonyType;

    @Column({ nullable: true })
    reference: string;

    @OneToMany(() => CeremonyMedia, (ceremonyMedia) => ceremonyMedia.ceremony, { cascade: true })
    ceremonyMedias: CeremonyMedia[];

    @OneToMany(() => CeremonyTag, (ceremonyTag) => ceremonyTag.ceremony, { cascade: true })
    ceremonyTags: CeremonyTag[];

    @OneToMany(() => Offering, (offering) => offering.ceremony, { cascade: true })
    offerings: Offering[];

    @OneToMany(() => Prayer, (prayer) => prayer.ceremony, { cascade: true })
    prayers: Prayer[];

    constructor(partial: Partial<Ceremony>) {
        super();
        Object.assign(this, partial);
    }
}
