import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionFeatureService } from './subscription-feature.service';
import { CreateSubscriptionFeatureDto } from './dto/create-subscription-feature.dto';
import { UpdateSubscriptionFeatureDto } from './dto/update-subscription-feature.dto';

@Controller('subscription-feature')
export class SubscriptionFeatureController {
  constructor(private readonly subscriptionFeatureService: SubscriptionFeatureService) {}

  @Post()
  create(@Body() createSubscriptionFeatureDto: CreateSubscriptionFeatureDto) {
    return this.subscriptionFeatureService.create(createSubscriptionFeatureDto);
  }

  @Get()
  findAll() {
    return this.subscriptionFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionFeatureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriptionFeatureDto: UpdateSubscriptionFeatureDto) {
    return this.subscriptionFeatureService.update(+id, updateSubscriptionFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionFeatureService.remove(+id);
  }
}
