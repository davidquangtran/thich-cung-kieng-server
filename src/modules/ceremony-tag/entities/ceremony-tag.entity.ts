import { AbstractEntity } from "src/common/base/entity.base";
import { Ceremony } from "src/modules/ceremony/entities/ceremony.entity";
import { Tag } from "src/modules/tag/entities/tag.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ceremony_tags' })
export class CeremonyTag extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ceremonyId: string;

    @Column()
    tagId: string;

    @ManyToOne(() => Ceremony, (ceremony) => ceremony.ceremonyTags)
    ceremony: Ceremony;

    @ManyToOne(() => Tag, (tag) => tag.ceremonyTags)
    tag: Tag;

    constructor(partial: Partial<CeremonyTag>) {
        super();
        Object.assign(this, partial);
    }
}
