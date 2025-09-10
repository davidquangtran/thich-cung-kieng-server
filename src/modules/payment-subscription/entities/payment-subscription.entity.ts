import { AbstractEntity } from "src/common/base/entity.base";
import { Payment } from "src/modules/payment/entities/payment.entity";
import { UserSubscription } from "src/modules/user-subscription/entities/user-subscription.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payment_subscriptions' })
export class PaymentSubscription extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({ name: 'payment_id' })
    paymentId: string;

    @Column({ name: 'user_subscription_id' })
    userSubscriptionId: string;

    @ManyToOne(() => Payment, (payment) => payment.paymentSubscriptions)
    payment: Payment;

    @ManyToOne(() => UserSubscription, (userSubscription) => userSubscription.paymentSubscriptions)
    userSubscription: UserSubscription;

    constructor(partial: Partial<PaymentSubscription>) {
        super();
        Object.assign(this, partial);
    }
}