import { AbstractEntity } from "src/common/base/entity.base";
import { Ceremony } from "src/modules/ceremony/entities/ceremony.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'prayers' })
export class Prayer extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    content: string;

    @Column({ nullable: true })
    note: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => Ceremony, (ceremony) => ceremony.prayers)
    ceremony: Ceremony;

    constructor(partial: Partial<Prayer>) {
        super();
        Object.assign(this, partial);
    }
}
