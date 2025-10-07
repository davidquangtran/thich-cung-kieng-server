import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UserEventService } from './user-event.service';
import { UpdateUserEventDto } from './dto/update-user-event.dto';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';
import { CreateUserEventWithRelationshipDto } from './dto/create-user-event-with-relationship.dto';
import { UpdateUserEventWithRelationshipDto } from './dto/update-user-event-with-relationship.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Public()
@Controller('user-event')
export class UserEventController {
  constructor(private readonly userEventService: UserEventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user event with relations' })
  @ApiBody({ type: CreateUserEventWithRelationshipDto })
  @ApiResponse({
    status: 201,
    description: 'User event with relations created successfully',
  })
  create(@Body() body: CreateUserEventWithRelationshipDto) {
    const { userEvent, relations } = body;
    if (relations && Object.keys(relations).length > 0) {
      return this.userEventService.createWithRelations(userEvent, relations);
    } else {
      return this.userEventService.create(userEvent);
    }
  }

  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.userEventService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userEventService.findOne(id, ['reminders', 'offerings']);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user event' })
  @ApiBody({ type: UpdateUserEventWithRelationshipDto })
  @ApiResponse({ status: 200, description: 'User event updated successfully' })
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserEventWithRelationshipDto,
  ) {
    const { userEvent, relations } = body;
    if (relations && Object.keys(relations).length > 0) {
      return this.userEventService.updateWithRelations(
        id,
        userEvent as UpdateUserEventDto,
        relations,
      );
    } else {
      return this.userEventService.update(id, userEvent as UpdateUserEventDto);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userEventService.softRemove(id);
  }
}
