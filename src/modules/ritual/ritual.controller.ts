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
import { CreateRitualWithRelationsDto } from './dto/create-ritual-with-relations.dto';

@Public()
@ApiTags('Rituals')
@Controller('ritual')
export class RitualController {
  constructor(private readonly ritualService: RitualService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ritual' })
  @ApiBody({ type: CreateRitualDto })
  @ApiResponse({ status: 201, description: 'Ritual created successfully' })
  async create(@Body() createRitualDto: CreateRitualDto) {
    return await this.ritualService.create(createRitualDto);
  }

  @Post('with-relations')
  @ApiOperation({ summary: 'Create a new ritual with relations' })
  @ApiBody({ type: CreateRitualWithRelationsDto })
  @ApiResponse({
    status: 201,
    description: 'Ritual with relations created successfully',
  })
  async createWithRelations(@Body() body: CreateRitualWithRelationsDto) {
    const { ritual, relations } = body;

    if (relations && Object.keys(relations).length > 0) {
      return await this.ritualService.createWithRelations(ritual, relations);
    } else {
      return await this.ritualService.create(ritual);
    }
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
