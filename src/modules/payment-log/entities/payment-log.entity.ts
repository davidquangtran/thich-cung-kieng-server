import { AbstractEntity } from "src/common/base/entity.base";
import { Payment } from "src/modules/payment/entities/payment.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: 'payment_logs' })
export class PaymentLog extends AbstractEntity {
    @Column()
    old_status: string;

    @Column()
    new_status: string;

    @Column()
    description: string;

    @Column()
    logged_at: Date;

    @Column({ name: 'payment_id' })
    paymentId: string;

    @ManyToOne(() => Payment, (payment) => payment.paymentLogs)
    payment: Payment;


    constructor(partial: Partial<PaymentLog>) {
        super();
        Object.assign(this, partial);
    }
}
