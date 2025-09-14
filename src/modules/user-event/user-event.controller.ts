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
import { Public } from 'src/common/decorators/public.decorator';
import { UserEventService } from './user-event.service';
import { CreateUserEventDto } from './dto/create-user-event.dto';
import { UpdateUserEventDto } from './dto/update-user-event.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

@Public()
@Controller('user-event')
export class UserEventController {
  constructor(private readonly userEventService: UserEventService) {}

  @Post()
  create(@Body() createUserEventDto: CreateUserEventDto) {
    return this.userEventService.create(createUserEventDto);
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.userEventService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userEventService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserEventDto: UpdateUserEventDto,
  ) {
    return this.userEventService.update(id, updateUserEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userEventService.delete(id);
  }
}
