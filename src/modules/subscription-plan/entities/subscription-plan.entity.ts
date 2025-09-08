import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'subscription_plans' })
export class SubscriptionPlan extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<SubscriptionPlan>) {
        super();
        Object.assign(this, partial);
    }
}
