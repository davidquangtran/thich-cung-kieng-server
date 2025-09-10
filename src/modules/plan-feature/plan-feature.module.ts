import { Module } from '@nestjs/common';
import { PlanFeatureService } from './plan-feature.service';
import { PlanFeatureController } from './plan-feature.controller';

@Module({
  controllers: [PlanFeatureController],
  providers: [PlanFeatureService],
})
export class PlanFeatureModule {}
