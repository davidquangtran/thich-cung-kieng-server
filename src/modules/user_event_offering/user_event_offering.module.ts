import { Module } from '@nestjs/common';
import { UserEventOfferingService } from './user_event_offering.service';
import { UserEventOfferingController } from './user_event_offering.controller';

@Module({
  controllers: [UserEventOfferingController],
  providers: [UserEventOfferingService],
})
export class UserEventOfferingModule {}
