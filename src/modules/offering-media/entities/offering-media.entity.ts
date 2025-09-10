import { AbstractEntity } from "src/common/base/entity.base";
import { MediaType } from "src/common/enums/media-type.enum";
import { Offering } from "src/modules/offering/entities/offering.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('offering_media')
export class OfferingMedia extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: MediaType, default: MediaType.IMAGE })
    type: MediaType;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    alt: string;

    @ManyToOne(() => Offering, (offering) => offering.offeringMedias)
    offering: Offering;

    constructor(partial: Partial<OfferingMedia>) {
        super();
        Object.assign(this, partial);
    }
}
