import { AbstractEntity } from "src/common/base/entity.base";
import { UserSubscriptionStatus } from "src/common/enums/user-subscription.enum";
import { Payment } from "src/modules/payment/entities/payment.entity";
import { SubscriptionPlan } from "src/modules/subscription-plan/entities/subscription-plan.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

@Entity({ name: 'user_subscriptions' })
export class UserSubscription extends AbstractEntity {
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

    @OneToOne(() => Payment, (payment) => payment.userSubscription)
    payment: Payment;

    constructor(partial: Partial<UserSubscription>) {
        super();
        Object.assign(this, partial);
    }
}
