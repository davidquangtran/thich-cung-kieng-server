import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ceremonies' })
export class Ceremony extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    constructor(partial: Partial<Ceremony>) {
        super();
        Object.assign(this, partial);
    }
}
