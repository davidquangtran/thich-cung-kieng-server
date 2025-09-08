import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payment_logs' })
export class PaymentLog extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<PaymentLog>) {
        super();
        Object.assign(this, partial);
    }
}
