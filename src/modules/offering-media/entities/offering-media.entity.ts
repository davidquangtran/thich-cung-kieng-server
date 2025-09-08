import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('offering_media')
export class OfferingMedia extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<OfferingMedia>) {
        super();
        Object.assign(this, partial);
    }
}
