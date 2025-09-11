import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserEventOfferingService } from './user_event_offering.service';
import { CreateUserEventOfferingDto } from './dto/create-user_event_offering.dto';
import { UpdateUserEventOfferingDto } from './dto/update-user_event_offering.dto';

@Controller('user-event-offering')
export class UserEventOfferingController {
  constructor(private readonly userEventOfferingService: UserEventOfferingService) {}

  @Post()
  create(@Body() createUserEventOfferingDto: CreateUserEventOfferingDto) {
    return this.userEventOfferingService.create(createUserEventOfferingDto);
  }

  @Get()
  findAll() {
    return this.userEventOfferingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userEventOfferingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserEventOfferingDto: UpdateUserEventOfferingDto) {
    return this.userEventOfferingService.update(+id, updateUserEventOfferingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userEventOfferingService.remove(+id);
  }
}
