import { AbstractEntity } from "src/common/base/entity.base";
import { PaymentProvider } from "src/common/enums/payment-provider.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { PaymentLog } from "src/modules/payment-log/entities/payment-log.entity";
import { PaymentSubscription } from "src/modules/payment-subscription/entities/payment-subscription.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payments' })
export class Payment extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ type: 'varchar', length: 10, default: 'VND' })
    currency: string;

    @Column({ type: 'enum', enum: PaymentProvider, default: PaymentProvider.MOMO })
    provider: PaymentProvider;

    @Column({ type: 'varchar', length: 100, nullable: true })
    transactionCode: string;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.INITIATED })
    status: PaymentStatus;

    @OneToMany(() => PaymentLog, (paymentLog) => paymentLog.payment, { cascade: true })
    paymentLogs: PaymentLog[];

    @OneToMany(() => PaymentSubscription, (paymentSubscription) => paymentSubscription.payment, { cascade: true })
    paymentSubscriptions: PaymentSubscription[];

    @ManyToOne(() => User, (user) => user.payments)
    user: User;

    constructor(partial: Partial<Payment>) {
        super();
        Object.assign(this, partial);
    }
}
