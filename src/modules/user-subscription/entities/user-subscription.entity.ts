import { AbstractEntity } from "src/common/base/entity.base";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user_subscriptions' })
export class UserSubscription extends AbstractEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    constructor(partial: Partial<UserSubscription>) {
        super();
        Object.assign(this, partial);
    }
}
