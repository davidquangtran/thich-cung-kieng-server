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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { RitualService } from './ritual.service';
import { CreateRitualDto } from './dto/create-ritual.dto';
import { UpdateRitualDto } from './dto/update-ritual.dto';
import { FilterRitualDto } from './dto/filter-ritual.dto';

@Public()
@ApiTags('Rituals')
@Controller('ritual')
export class RitualController {
  constructor(private readonly ritualService: RitualService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ritual' })
  @ApiBody({ type: CreateRitualDto })
  @ApiResponse({ status: 201, description: 'Ritual created successfully' })
  create(@Body() createRitualDto: CreateRitualDto) {
    return this.ritualService.create(createRitualDto);
  }

  @Get()
  findAll(@Query() filter: FilterRitualDto) {
    return this.ritualService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ritual' })
  @ApiBody({ type: UpdateRitualDto })
  @ApiResponse({ status: 200, description: 'Ritual updated successfully' })
  update(@Param('id') id: string, @Body() updateRitualDto: UpdateRitualDto) {
    return this.ritualService.update(id, updateRitualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualService.delete(id);
  }
}
