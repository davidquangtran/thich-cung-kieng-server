import { PartialType } from '@nestjs/mapped-types';
import { CreateCeremonyMediaDto } from './create-ceremony-media.dto';

export class UpdateCeremonyMediaDto extends PartialType(CreateCeremonyMediaDto) {}
