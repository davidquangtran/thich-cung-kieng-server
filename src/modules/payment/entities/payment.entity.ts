import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payments' })
export class Payment extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<Payment>) {
        super();
        Object.assign(this, partial);
    }
}
