import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ceremony_tags' })
export class CeremonyTag extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<CeremonyTag>) {
        super();
        Object.assign(this, partial);
    }
}
