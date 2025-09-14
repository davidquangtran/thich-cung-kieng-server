import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RitualReviewService } from './ritual-review.service';
import { CreateRitualReviewDto } from './dto/create-ritual-review.dto';
import { UpdateRitualReviewDto } from './dto/update-ritual-review.dto';

@Controller('ritual-review')
export class RitualReviewController {
  constructor(private readonly ritualReviewService: RitualReviewService) {}

  @Post()
  create(@Body() createRitualReviewDto: CreateRitualReviewDto) {
    return this.ritualReviewService.create(createRitualReviewDto);
  }

  @Get()
  findAll() {
    return this.ritualReviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualReviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRitualReviewDto: UpdateRitualReviewDto) {
    return this.ritualReviewService.update(+id, updateRitualReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualReviewService.remove(+id);
  }
}
