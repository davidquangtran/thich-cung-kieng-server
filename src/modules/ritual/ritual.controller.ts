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
import { RitualService } from './ritual.service';
import { CreateRitualDto } from './dto/create-ritual.dto';
import { UpdateRitualDto } from './dto/update-ritual.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Controller('ritual')
export class RitualController {
  constructor(private readonly ritualService: RitualService) {}

  @Post()
  create(@Body() createRitualDto: CreateRitualDto) {
    return this.ritualService.create(createRitualDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.ritualService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRitualDto: UpdateRitualDto) {
    return this.ritualService.update(id, updateRitualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualService.delete(id);
  }
}
