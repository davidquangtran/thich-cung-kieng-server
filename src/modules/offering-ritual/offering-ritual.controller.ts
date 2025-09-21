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
import { OfferingRitualService } from './offering-ritual.service';
import { CreateOfferingRitualDto } from './dto/create-offering-ritual.dto';
import { UpdateOfferingRitualDto } from './dto/update-offering-ritual.dto';

@Controller('offering-ritual')
export class OfferingRitualController {
  constructor(private readonly offeringRitualService: OfferingRitualService) {}

  @Post()
  create(@Body() createOfferingRitualDto: CreateOfferingRitualDto) {
    return this.offeringRitualService.create(createOfferingRitualDto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.offeringRitualService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offeringRitualService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferingRitualDto: UpdateOfferingRitualDto,
  ) {
    return this.offeringRitualService.update(id, updateOfferingRitualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offeringRitualService.remove(id);
  }
}
