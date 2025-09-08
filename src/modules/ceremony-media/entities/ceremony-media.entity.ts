import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ceremony_medias' })
export class CeremonyMedia extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<CeremonyMedia>) {
        super();
        Object.assign(this, partial);
    }
}
