import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RitualCategoryService } from './ritual-category.service';
import { CreateRitualCategoryDto } from './dto/create-ritual-category.dto';
import { UpdateRitualCategoryDto } from './dto/update-ritual-category.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Controller('ritual-category')
export class RitualCategoryController {
  constructor(private readonly ritualCategoryService: RitualCategoryService) {}

  @Post()
  create(@Body() createRitualCategoryDto: CreateRitualCategoryDto) {
    return this.ritualCategoryService.create(createRitualCategoryDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.ritualCategoryService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualCategoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRitualCategoryDto: UpdateRitualCategoryDto,
  ) {
    return this.ritualCategoryService.update(id, updateRitualCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualCategoryService.delete(id);
  }
}
