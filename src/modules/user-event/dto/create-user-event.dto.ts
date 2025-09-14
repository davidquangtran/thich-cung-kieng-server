import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  UserEventRepeatRule,
  UserEventStatus,
} from 'src/common/enums/user-event.enum';

export class CreateUserEventDto {
  @ApiProperty({
    description: 'ID of the user creating the event',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Title of the event',
    example: 'Lễ cúng tổ tiên',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'Lễ cúng tổ tiên hàng năm vào ngày giỗ',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Location where the event takes place',
    example: 'Nhà thờ họ Nguyễn, Hà Nội',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Date and time of the event',
    example: '2024-12-31T10:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  eventDate: string;

  @ApiProperty({
    description: 'Repeat rule for recurring events',
    enum: UserEventRepeatRule,
    example: UserEventRepeatRule.NONE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserEventRepeatRule)
  repeatRule?: UserEventRepeatRule;

  @ApiProperty({
    description: 'Status of the event',
    enum: UserEventStatus,
    example: UserEventStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserEventStatus)
  status?: UserEventStatus;
}
