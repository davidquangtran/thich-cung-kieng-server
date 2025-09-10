import { Injectable } from '@nestjs/common';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';

@Injectable()
export class PlanFeatureService {
  create(createPlanFeatureDto: CreatePlanFeatureDto) {
    return 'This action adds a new planFeature';
  }

  findAll() {
    return `This action returns all planFeature`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planFeature`;
  }

  update(id: number, updatePlanFeatureDto: UpdatePlanFeatureDto) {
    return `This action updates a #${id} planFeature`;
  }

  remove(id: number) {
    return `This action removes a #${id} planFeature`;
  }
}
