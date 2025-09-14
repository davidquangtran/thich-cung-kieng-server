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
import { OfferingService } from './offering.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Controller('offering')
export class OfferingController {
  constructor(private readonly offeringService: OfferingService) {}

  @Post()
  create(@Body() createOfferingDto: CreateOfferingDto) {
    return this.offeringService.create(createOfferingDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.offeringService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offeringService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferingDto: UpdateOfferingDto,
  ) {
    return this.offeringService.update(id, updateOfferingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offeringService.delete(id);
  }
}
