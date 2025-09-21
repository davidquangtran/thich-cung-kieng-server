import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { MediaType } from 'src/common/enums/media.enum';
import { CreateOfferingDto } from './create-offering.dto';
import { Type } from 'class-transformer';

export class OfferingMediasDto {
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
    example: 'https://example.com/offering-image.jpg',
    format: 'url',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({
    description: 'Alt text for the media',
    example: 'Hình ảnh mâm cúng 5 món hoa quả',
    required: false,
  })
  @IsOptional()
  @IsString()
  alt?: string;
}

export class OfferingRelationsDto {
  @ApiProperty({
    description: 'List of media associated with the offering',
    type: [OfferingMediasDto],
    required: false,
    example: [
      {
        type: MediaType.IMAGE,
        url: 'https://example.com/offering-image.jpg',
        alt: 'Hình ảnh mâm cúng 5 món hoa quả',
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OfferingMediasDto)
  offeringMedias?: OfferingMediasDto[];
}

export class CreateOfferingWithRelationsDto {
  @ApiProperty({
    description: 'Details of the offering to create',
    example:
      '{ "name": "Bánh chưng", "description": "Bánh chưng truyền thống", "price": 50000 }',
  })
  @ValidateNested()
  @Type(() => CreateOfferingDto)
  offering: CreateOfferingDto;

  @ApiProperty({
    description: 'Related entities for the offering',
    required: false,
    type: OfferingRelationsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OfferingRelationsDto)
  relations?: OfferingRelationsDto;
}
