import { Module } from '@nestjs/common';
import { UserEventReminderService } from './user_event_reminder.service';
import { UserEventReminderController } from './user_event_reminder.controller';

@Module({
  controllers: [UserEventReminderController],
  providers: [UserEventReminderService],
})
export class UserEventReminderModule {}
