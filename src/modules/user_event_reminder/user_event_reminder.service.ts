import { Injectable } from '@nestjs/common';
import { CreateUserEventReminderDto } from './dto/create-user_event_reminder.dto';
import { UpdateUserEventReminderDto } from './dto/update-user_event_reminder.dto';

@Injectable()
export class UserEventReminderService {
  create(createUserEventReminderDto: CreateUserEventReminderDto) {
    return 'This action adds a new userEventReminder';
  }

  findAll() {
    return `This action returns all userEventReminder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userEventReminder`;
  }

  update(id: number, updateUserEventReminderDto: UpdateUserEventReminderDto) {
    return `This action updates a #${id} userEventReminder`;
  }

  remove(id: number) {
    return `This action removes a #${id} userEventReminder`;
  }
}
