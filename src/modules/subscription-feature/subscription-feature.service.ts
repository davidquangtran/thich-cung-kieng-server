import { Injectable } from '@nestjs/common';
import { CreateSubscriptionFeatureDto } from './dto/create-subscription-feature.dto';
import { UpdateSubscriptionFeatureDto } from './dto/update-subscription-feature.dto';

@Injectable()
export class SubscriptionFeatureService {
  create(createSubscriptionFeatureDto: CreateSubscriptionFeatureDto) {
    return 'This action adds a new subscriptionFeature';
  }

  findAll() {
    return `This action returns all subscriptionFeature`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionFeature`;
  }

  update(id: number, updateSubscriptionFeatureDto: UpdateSubscriptionFeatureDto) {
    return `This action updates a #${id} subscriptionFeature`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionFeature`;
  }
}
