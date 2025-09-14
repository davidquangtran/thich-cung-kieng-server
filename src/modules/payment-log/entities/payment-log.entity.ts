import { AbstractEntity } from 'src/common/base/entity.base';
import { PaymentStatus } from 'src/common/enums/payment.enum';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'payment_logs' })
export class PaymentLog extends AbstractEntity {
  @Column({
    name: 'old_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  oldStatus: PaymentStatus.PENDING;

  @Column({
    name: 'new_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  newStatus: PaymentStatus.COMPLETED;

  @Column()
  description: string;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.paymentLogs)
  payment: Payment;

  constructor(partial: Partial<PaymentLog>) {
    super();
    Object.assign(this, partial);
  }
}
