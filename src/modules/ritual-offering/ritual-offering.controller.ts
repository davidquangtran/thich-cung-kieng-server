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
import { CreateRitualOfferingDto } from './dto/create-ritual-offering.dto';
import { UpdateRitualOfferingDto } from './dto/update-ritual-offering.dto';
import { RitualOfferingService } from './ritual-offering.service';

@Controller('offering-ritual')
export class RitualOfferingController {
  constructor(private readonly ritualOfferingService: RitualOfferingService) {}

  @Post()
  create(@Body() createRitualOfferingDto: CreateRitualOfferingDto) {
    return this.ritualOfferingService.create(createRitualOfferingDto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.ritualOfferingService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualOfferingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRitualOfferingDto: UpdateRitualOfferingDto,
  ) {
    return this.ritualOfferingService.update(id, updateRitualOfferingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualOfferingService.remove(id);
  }
}
