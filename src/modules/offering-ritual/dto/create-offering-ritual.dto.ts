import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOfferingRitualDto {
  @ApiProperty({
    description: 'ID of the associated ritual',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  ritualId: string;
  @ApiProperty({
    description: 'ID of the associated offering',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  offeringId: string;

  @ApiProperty({
    description: 'Quantity of the offering in the ritual (defaults to 1)',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number = 1;
}
