import { PartialType } from '@nestjs/mapped-types';
import { CreateCeremonyTagDto } from './create-ceremony-tag.dto';

export class UpdateCeremonyTagDto extends PartialType(CreateCeremonyTagDto) {}
