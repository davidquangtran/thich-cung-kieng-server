import { Injectable } from '@nestjs/common';
import { CreatePaymentSubscriptionDto } from './dto/create-payment-subscription.dto';
import { UpdatePaymentSubscriptionDto } from './dto/update-payment-subscription.dto';

@Injectable()
export class PaymentSubscriptionService {
  create(createPaymentSubscriptionDto: CreatePaymentSubscriptionDto) {
    return 'This action adds a new paymentSubscription';
  }

  findAll() {
    return `This action returns all paymentSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentSubscription`;
  }

  update(id: number, updatePaymentSubscriptionDto: UpdatePaymentSubscriptionDto) {
    return `This action updates a #${id} paymentSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentSubscription`;
  }
}
