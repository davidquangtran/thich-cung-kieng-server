import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'offerings' })
export class Offering extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    constructor(partial: Partial<Offering>) {
        super();
        Object.assign(this, partial);
    }
}
