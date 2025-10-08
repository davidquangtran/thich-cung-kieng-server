import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UserEventService } from './user-event.service';
import { UpdateUserEventDto } from './dto/update-user-event.dto';
import { CreateUserEventWithRelationshipDto } from './dto/create-user-event-with-relationship.dto';
import { UpdateUserEventWithRelationshipDto } from './dto/update-user-event-with-relationship.dto';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FilterUserEvent } from './dto/filter-user-event.dto';
import { User } from '../user/entities/user.entity';

@Controller('user-event')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing JWT token',
})
@ApiForbiddenResponse({
  description: 'Forbidden - Insufficient permissions',
})
export class UserEventController {
  constructor(private readonly userEventService: UserEventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user event with relations' })
  @ApiBody({ type: CreateUserEventWithRelationshipDto })
  @ApiResponse({
    status: 201,
    description: 'User event with relations created successfully',
  })
  async create(@Body() body: CreateUserEventWithRelationshipDto) {
    const { userEvent, relations } = body;
    if (relations && Object.keys(relations).length > 0) {
      return await this.userEventService.createWithRelations(
        userEvent,
        relations,
      );
    } else {
      return await this.userEventService.create(userEvent);
    }
  }

  @Get()
  async findAll(@Query() filter: FilterUserEvent, @GetUser() user: User) {
    if(user.role !== 'admin') {
      // Non-admin users can only see their own events
      filter.userId = user.id;
    }
    return await this.userEventService.findAll(filter, [], []);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userEventService.findOne(id, ['reminders', 'offerings']);
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
