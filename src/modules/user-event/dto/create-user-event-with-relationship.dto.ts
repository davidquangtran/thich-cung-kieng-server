import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  NotifyMethod,
  UserEventReminderStatus,
} from 'src/common/enums/user-event-reminder.enum';
import { CreateUserEventDto } from './create-user-event.dto';

export class CreateUserEventOfferingDto {
  @IsString()
  offeringName: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateUserEventReminderDto {
  @IsNumber()
  @IsPositive()
  remindBefore: number;

  @IsOptional()
  @IsEnum(NotifyMethod)
  notifyMethod?: NotifyMethod;

  @IsOptional()
  @IsEnum(UserEventReminderStatus)
  status?: UserEventReminderStatus;
}

export class UserEventRelationDto {
  @ApiProperty({
    description: 'List of reminders associated with the event',
    type: [CreateUserEventReminderDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateUserEventReminderDto)
  eventReminders?: CreateUserEventReminderDto[];

  @ApiProperty({
    description: 'List of offerings associated with the event',
    type: [CreateUserEventOfferingDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateUserEventOfferingDto)
  eventOfferings?: CreateUserEventOfferingDto[];
}

export class CreateUserEventWithRelationshipDto {
  @ApiProperty({
    description: 'Main user event data',
    type: CreateUserEventDto,
  })
  @ValidateNested()
  @Type(() => CreateUserEventDto)
  userEvent: CreateUserEventDto;

  @ApiProperty({
    description: 'Related entities data',
    type: UserEventRelationDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserEventRelationDto)
  relations?: UserEventRelationDto;
}
