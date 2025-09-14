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
import { RitualTagService } from './ritual-tag.service';
import { CreateRitualTagDto } from './dto/create-ritual-tag.dto';
import { UpdateRitualTagDto } from './dto/update-ritual-tag.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Controller('ritual-tag')
export class RitualTagController {
  constructor(private readonly ritualTagService: RitualTagService) {}

  @Post()
  create(@Body() createRitualTagDto: CreateRitualTagDto) {
    return this.ritualTagService.create(createRitualTagDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.ritualTagService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualTagService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRitualTagDto: UpdateRitualTagDto,
  ) {
    return this.ritualTagService.update(id, updateRitualTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualTagService.delete(id);
  }
}
