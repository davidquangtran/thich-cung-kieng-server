import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanFeatureService } from './plan-feature.service';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';

@Controller('plan-feature')
export class PlanFeatureController {
  constructor(private readonly planFeatureService: PlanFeatureService) {}

  @Post()
  create(@Body() createPlanFeatureDto: CreatePlanFeatureDto) {
    return this.planFeatureService.create(createPlanFeatureDto);
  }

  @Get()
  findAll() {
    return this.planFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planFeatureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanFeatureDto: UpdatePlanFeatureDto) {
    return this.planFeatureService.update(+id, updatePlanFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planFeatureService.remove(+id);
  }
}
