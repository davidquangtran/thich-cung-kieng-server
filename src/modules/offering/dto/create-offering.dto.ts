import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferingDto {
  @ApiProperty({
    description: 'Name of the offering',
    example: 'Hoa quả 5 món',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Quantity of the offering',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Description of the offering',
    example: 'Hoa quả tươi gồm: táo, cam, chuối, xoài, nho',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'ID of the associated ritual',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  ritualId?: string;
}
