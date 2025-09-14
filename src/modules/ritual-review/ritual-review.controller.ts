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
import { RitualReviewService } from './ritual-review.service';
import { CreateRitualReviewDto } from './dto/create-ritual-review.dto';
import { UpdateRitualReviewDto } from './dto/update-ritual-review.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Controller('ritual-review')
export class RitualReviewController {
  constructor(private readonly ritualReviewService: RitualReviewService) {}

  @Post()
  create(@Body() createRitualReviewDto: CreateRitualReviewDto) {
    return this.ritualReviewService.create(createRitualReviewDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.ritualReviewService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualReviewService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRitualReviewDto: UpdateRitualReviewDto,
  ) {
    return this.ritualReviewService.update(id, updateRitualReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualReviewService.delete(id);
  }
}
