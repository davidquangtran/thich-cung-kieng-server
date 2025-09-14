import { Module } from '@nestjs/common';
import { RitualCategoryService } from './ritual-category.service';
import { RitualCategoryController } from './ritual-category.controller';

@Module({
  controllers: [RitualCategoryController],
  providers: [RitualCategoryService],
})
export class RitualCategoryModule {}
