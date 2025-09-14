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
import { FilterChatSessionDto } from '../chat-session/dto/filter-chat-session.dto';

@Public()
@ApiTags('Offerings')
@Controller('offering')
export class OfferingController {
  constructor(private readonly offeringService: OfferingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new offering' })
  @ApiBody({ type: CreateOfferingDto })
  @ApiResponse({ status: 201, description: 'Offering created successfully' })
  create(@Body() createOfferingDto: CreateOfferingDto) {
    return this.offeringService.create(createOfferingDto);
  }

  @Get()
  findAll(@Query() filter: FilterChatSessionDto) {
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
