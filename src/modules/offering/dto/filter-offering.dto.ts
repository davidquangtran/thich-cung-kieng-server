import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

export class FilterOfferingDto extends PartialType(BaseFilterDto) {
  @ApiPropertyOptional({
    description: 'Quantity of the offering',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsString()
  quantity?: number;
}
