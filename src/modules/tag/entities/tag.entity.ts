import { AbstractEntity } from "src/common/base/entity.base";
import { CeremonyTag } from "src/modules/ceremony-tag/entities/ceremony-tag.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'tags' })
export class Tag extends AbstractEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => CeremonyTag, (ceremonyTag) => ceremonyTag.tag, { cascade: true })
    ceremonyTags: CeremonyTag[];

    constructor(partial: Partial<Tag>) {
        super();
        Object.assign(this, partial);
    }
}
