import { AbstractEntity } from "src/common/base/entity.base";
import { SubscriptionFeature } from "src/modules/subscription-feature/entities/subscription-feature.entity";
import { SubscriptionPlan } from "src/modules/subscription-plan/entities/subscription-plan.entity";
import { Column, Entity,ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'plan_features' })
export class PlanFeature extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subscriptionPlanId: string;

    @Column()
    subscriptionFeatureId: string;

    @ManyToOne(() => SubscriptionFeature, (subscriptionFeature) => subscriptionFeature.planFeatures)
    subscriptionFeature: SubscriptionFeature;

    @ManyToOne(() => SubscriptionPlan, (subscriptionPlan) => subscriptionPlan.planFeatures)
    subscriptionPlan: SubscriptionPlan;

    constructor(partial: Partial<PlanFeature>) {
        super();
        Object.assign(this, partial);
    }
}