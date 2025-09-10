import { AbstractEntity } from "src/common/base/entity.base";
import { UserSubscriptionStatus } from "src/common/enums/user-subscription-status.enum";
import { PaymentSubscription } from "src/modules/payment-subscription/entities/payment-subscription.entity";
import { SubscriptionPlan } from "src/modules/subscription-plan/entities/subscription-plan.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user_subscriptions' })
export class UserSubscription extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'start_date', type: 'timestamp' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp' })
    endDate: Date;

    @Column({ name: 'status', type: 'enum', enum: UserSubscriptionStatus, default: UserSubscriptionStatus.PENDING })
    status: UserSubscriptionStatus;

    @Column({ name: 'auto_renew', type: 'boolean', default: false })
    autoRenew: boolean;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'subscription_plan_id' })
    subscriptionPlanId: string;

    @ManyToOne(() => User, (user) => user.userSubscriptions)
    user: User;

    @ManyToOne(() => SubscriptionPlan, (subscriptionPlan) => subscriptionPlan.userSubscriptions)
    subscriptionPlan: SubscriptionPlan;

    @OneToMany(() => PaymentSubscription, (paymentSubscription) => paymentSubscription.userSubscription, { cascade: true })
    paymentSubscriptions: PaymentSubscription[];

    constructor(partial: Partial<UserSubscription>) {
        super();
        Object.assign(this, partial);
    }
}
