import { Injectable } from '@nestjs/common';
import { CreatePaymentLogDto } from './dto/create-payment-log.dto';
import { UpdatePaymentLogDto } from './dto/update-payment-log.dto';

@Injectable()
export class PaymentLogService {
  create(createPaymentLogDto: CreatePaymentLogDto) {
    return 'This action adds a new paymentLog';
  }

  findAll() {
    return `This action returns all paymentLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentLog`;
  }

  update(id: number, updatePaymentLogDto: UpdatePaymentLogDto) {
    return `This action updates a #${id} paymentLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentLog`;
  }
}
