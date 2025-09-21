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
import { OfferingService } from './offering.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { FilterOfferingDto } from './dto/filter-offering.dto';
import { CreateOfferingWithRelationsDto } from './dto/create-offering-with-relations.dto';

@Public()
@ApiTags('Offerings')
@Controller('offering')
export class OfferingController {
  constructor(private readonly offeringService: OfferingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offering' })
  @ApiBody({ type: CreateOfferingDto })
  @ApiResponse({ status: 201, description: 'Offering created successfully' })
  async create(@Body() createOfferingDto: CreateOfferingDto) {
    return this.offeringService.create(createOfferingDto);
  }

  @Post('with-relations')
  @ApiOperation({ summary: 'Create a new offering' })
  @ApiBody({ type: CreateOfferingWithRelationsDto })
  @ApiResponse({ status: 201, description: 'Offering created successfully' })
  async createWithRelations(@Body() body: CreateOfferingWithRelationsDto) {
    const { offering, relations } = body;

    if (relations && Object.keys(relations).length > 0) {
      return this.offeringService.createWithRelations(offering, relations);
    } else {
      return this.offeringService.create(offering);
    }
  }

  @Get()
  findAll(@Query() filter: FilterOfferingDto) {
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
