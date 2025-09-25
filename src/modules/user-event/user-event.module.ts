import { Module } from '@nestjs/common';
import { UserEventService } from './user-event.service';
import { UserEventController } from './user-event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from './entities/user-event.entity';
import { RedisModule } from 'src/shared/redis/redis.module';
import { UserEventReminderModule } from '../user_event_reminder/user_event_reminder.module';
import { UserEventOfferingModule } from '../user_event_offering/user_event_offering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEvent], 'postgresql'),
    RedisModule,
    UserEventReminderModule,
    UserEventOfferingModule,
  ],
  controllers: [UserEventController],
  providers: [UserEventService],
  exports: [UserEventService],
})
export class UserEventModule {}
