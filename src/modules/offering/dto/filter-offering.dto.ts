import { PartialType } from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';

export class FilterOfferingDto extends PartialType(BaseFilterDto) {}
