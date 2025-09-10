import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentSubscriptionService } from './payment-subscription.service';
import { CreatePaymentSubscriptionDto } from './dto/create-payment-subscription.dto';
import { UpdatePaymentSubscriptionDto } from './dto/update-payment-subscription.dto';

@Controller('payment-subscription')
export class PaymentSubscriptionController {
  constructor(private readonly paymentSubscriptionService: PaymentSubscriptionService) {}

  @Post()
  create(@Body() createPaymentSubscriptionDto: CreatePaymentSubscriptionDto) {
    return this.paymentSubscriptionService.create(createPaymentSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.paymentSubscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentSubscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentSubscriptionDto: UpdatePaymentSubscriptionDto) {
    return this.paymentSubscriptionService.update(+id, updatePaymentSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentSubscriptionService.remove(+id);
  }
}
