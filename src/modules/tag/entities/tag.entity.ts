import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tags' })
export class Tag extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<Tag>) {
        super();
        Object.assign(this, partial);
    }
}
