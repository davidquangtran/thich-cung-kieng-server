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
import { RitualMediaService } from './ritual-media.service';
import { CreateRitualMediaDto } from './dto/create-ritual-media.dto';
import { UpdateRitualMediaDto } from './dto/update-ritual-media.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Controller('ritual-media')
export class RitualMediaController {
  constructor(private readonly ritualMediaService: RitualMediaService) {}

  @Post()
  create(@Body() createRitualMediaDto: CreateRitualMediaDto) {
    return this.ritualMediaService.create(createRitualMediaDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.ritualMediaService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualMediaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRitualMediaDto: UpdateRitualMediaDto,
  ) {
    return this.ritualMediaService.update(id, updateRitualMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualMediaService.delete(id);
  }
}
