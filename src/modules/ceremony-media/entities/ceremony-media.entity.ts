import { AbstractEntity } from "src/common/base/entity.base";
import { MediaType } from "src/common/enums/media-type.enum";
import { Ceremony } from "src/modules/ceremony/entities/ceremony.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ceremony_medias' })
export class CeremonyMedia extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: MediaType, default: MediaType.IMAGE })
    type: MediaType;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    alt: string;

    @ManyToOne(() => Ceremony, (ceremony) => ceremony.ceremonyMedias)
    ceremony: Ceremony;

    constructor(partial: Partial<CeremonyMedia>) {
        super();
        Object.assign(this, partial);
    }
}
