import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { OfferingService } from './offering.service';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';
import { FilterOfferingDto } from './dto/filter-offering.dto';
import { CreateOfferingWithRelationsDto } from './dto/create-offering-with-relations.dto';
import { UpdateOfferingWithRelationsDto } from './dto/update-offering-with-relations.dto';

@Public()
@ApiTags('Offerings')
@Controller('offering')
export class OfferingController {
  constructor(private readonly offeringService: OfferingService) {}
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
    return this.offeringService.findAll(filter, ['offeringMedias'], []);
  }

  @Get('select')
  select() {
    return this.offeringService.selectOptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offeringService.findOne(id, ['offeringMedias']);
  }

  @Put(':id/with-relations')
  @ApiOperation({ summary: 'Update an offering with relations' })
  @ApiBody({ type: UpdateOfferingWithRelationsDto })
  @ApiResponse({
    status: 200,
    description: 'Offering updated successfully with relations',
  })
  async updateWithRelations(
    @Param('id') id: string,
    @Body() body: UpdateOfferingWithRelationsDto,
  ) {
    const { offering, relations } = body;

    if (relations && Object.keys(relations).length > 0) {
      return this.offeringService.updateWithRelations(id, offering, relations);
    } else {
      return this.offeringService.update(id, offering);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an offering' })
  @ApiResponse({ status: 200, description: 'Offering deleted successfully' })
  remove(@Param('id') id: string) {
    return this.offeringService.remove(id);
  }
}
