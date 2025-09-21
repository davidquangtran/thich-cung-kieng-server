import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  ValidateNested,
  IsArray,
  IsEnum,
  IsUrl,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRitualDto } from './create-ritual.dto';
import { MediaType } from 'src/common/enums/media.enum';

export class RitualMediaInputDto {
  @ApiProperty({
    description: 'Type of media (image, video, etc.)',
    enum: MediaType,
    example: MediaType.IMAGE,
    required: false,
  })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @ApiProperty({
    description: 'URL of the media file',
    example: 'https://example.com/ritual-guide.jpg',
    format: 'url',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    description: 'Alt text for the media',
    example: 'Hướng dẫn thực hiện lễ cúng rằm',
    required: false,
  })
  @IsOptional()
  @IsString()
  alt?: string;
}

export class RitualTagInputDto {
  @ApiProperty({
    description: 'ID of the tag',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  @IsUUID()
  tagId: string;
}

export class RitualOfferingInputDto {
  @ApiProperty({
    description: 'ID of the associated offering',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  offeringId: string;

  @ApiProperty({
    description:
      'Quantity of the offering in the ritual (defaults to 1 if not provided)',
    example: 3,
    minimum: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number = 1;
}

export class RitualRelationsDto {
  @ApiProperty({
    description: 'Ritual offerings to associate',
    type: [RitualOfferingInputDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RitualOfferingInputDto)
  ritualOfferings?: RitualOfferingInputDto[];

  @ApiProperty({
    description: 'Ritual media to associate (1-N relationship)',
    type: [RitualMediaInputDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RitualMediaInputDto)
  ritualMedias?: RitualMediaInputDto[];

  @ApiProperty({
    description: 'Ritual tags to associate',
    type: [RitualTagInputDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RitualTagInputDto)
  ritualTags?: RitualTagInputDto[];
}

export class CreateRitualWithRelationsDto {
  @ApiProperty({
    description: 'Main ritual data',
    type: CreateRitualDto,
  })
  @ValidateNested()
  @Type(() => CreateRitualDto)
  ritual: CreateRitualDto;

  @ApiProperty({
    description: 'Optional relations data',
    type: RitualRelationsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RitualRelationsDto)
  relations?: RitualRelationsDto;
}
